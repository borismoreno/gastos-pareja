


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."crear_notificacion"("hogar" "uuid", "receptor" "uuid", "emisor" "uuid", "tipo" "text", "mensaje" "text", "metadata" "jsonb" DEFAULT '{}'::"jsonb") RETURNS "uuid"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  nueva_id uuid;
BEGIN
  INSERT INTO notificaciones (hogar_id, usuario_id, emisor_id, tipo, mensaje, metadata)
  VALUES (hogar, receptor, emisor, tipo, mensaje, metadata)
  RETURNING id INTO nueva_id;

  RETURN nueva_id;
END;
$$;


ALTER FUNCTION "public"."crear_notificacion"("hogar" "uuid", "receptor" "uuid", "emisor" "uuid", "tipo" "text", "mensaje" "text", "metadata" "jsonb") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."debug_auth"() RETURNS TABLE("uid" "uuid", "role" "text")
    LANGUAGE "sql" SECURITY DEFINER
    AS $$
  select auth.uid(), auth.role();
$$;


ALTER FUNCTION "public"."debug_auth"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."debug_auth_context"() RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  return json_build_object(
    'uid', auth.uid(),
    'role', auth.role()
  );
end;
$$;


ALTER FUNCTION "public"."debug_auth_context"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."invitar_miembro"("hogar" "uuid", "miembro" "uuid", "rol_in" "text" DEFAULT 'miembro'::"text") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  soy_admin boolean;
BEGIN
  -- Verificar que quien llama es admin del hogar
  SELECT EXISTS (
    SELECT 1
    FROM usuario_hogar
    WHERE hogar_id = hogar
      AND user_id = auth.uid()
      AND rol = 'admin'
  ) INTO soy_admin;

  IF NOT soy_admin THEN
    RAISE EXCEPTION 'No tienes permisos para invitar miembros a este hogar';
  END IF;

  -- Verificar que el invitado no pertenezca ya a un hogar (por tu UNIQUE(user_id))
  IF EXISTS (SELECT 1 FROM usuario_hogar WHERE user_id = miembro) THEN
    RAISE EXCEPTION 'El usuario ya pertenece a un hogar';
  END IF;

  -- Insertar invitado
  INSERT INTO usuario_hogar (hogar_id, user_id, rol)
  VALUES (hogar, miembro, COALESCE(rol_in, 'miembro'));
END;
$$;


ALTER FUNCTION "public"."invitar_miembro"("hogar" "uuid", "miembro" "uuid", "rol_in" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."obtener_gastos_extendidos"("hogar" "uuid", "desde" "date", "hasta" "date") RETURNS TABLE("id" "uuid", "descripcion" "text", "monto" numeric, "categoria" "text", "fecha" "date", "creado_en" timestamp without time zone, "usuario_nombre" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    g.id,
    g.descripcion,
    g.monto,
    g.categoria,
    g.fecha,
    g.creado_en,
    g.usuario_nombre
  FROM public.vista_gastos_extendida g
  WHERE g.hogar_id = hogar
    AND g.fecha BETWEEN desde AND hasta
    AND EXISTS (
      SELECT 1 FROM public.usuario_hogar uh
      WHERE uh.hogar_id = hogar
      AND uh.user_id = auth.uid()
    )
  ORDER BY g.fecha DESC;
END;
$$;


ALTER FUNCTION "public"."obtener_gastos_extendidos"("hogar" "uuid", "desde" "date", "hasta" "date") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."obtener_resumen_mensual"("hogar" "uuid", "mes" integer, "anio" integer) RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
  resultado json;
BEGIN
  SELECT json_build_object(
    'total_mes', COALESCE(SUM(monto), 0),
    'por_categoria', json_object_agg(categoria, total_categoria)
  )
  INTO resultado
  FROM (
    SELECT categoria, SUM(monto) AS total_categoria
    FROM gastos
    WHERE hogar_id = hogar
    AND EXTRACT(MONTH FROM fecha) = mes
    AND EXTRACT(YEAR FROM fecha) = anio
    GROUP BY categoria
  ) AS sub;

  RETURN resultado;
END;
$$;


ALTER FUNCTION "public"."obtener_resumen_mensual"("hogar" "uuid", "mes" integer, "anio" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."obtener_usuarios_hogar"("hogar" "uuid") RETURNS TABLE("user_id" "uuid", "email" "text", "display_name" "text", "rol" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$BEGIN
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email::text,  -- 👈 conversión explícita
    COALESCE(
      u.raw_user_meta_data->>'displayName',
      u.raw_user_meta_data->>'display_name',
      u.raw_user_meta_data->>'full_name',
      u.email::text
    ) AS display_name,
    uh.rol::text
  FROM usuario_hogar uh
  JOIN auth.users u ON u.id = uh.user_id
  WHERE uh.hogar_id = hogar
  ORDER BY uh.rol, display_name;
END;$$;


ALTER FUNCTION "public"."obtener_usuarios_hogar"("hogar" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."comentarios" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "gasto_id" "uuid" NOT NULL,
    "usuario_id" "uuid" NOT NULL,
    "texto" "text" NOT NULL,
    "creado_en" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."comentarios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."gastos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hogar_id" "uuid" NOT NULL,
    "usuario_id" "uuid" NOT NULL,
    "descripcion" "text" NOT NULL,
    "categoria" "text",
    "monto" numeric(12,2) NOT NULL,
    "fecha" "date" DEFAULT CURRENT_DATE,
    "creado_en" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "gastos_monto_check" CHECK (("monto" > (0)::numeric))
);


ALTER TABLE "public"."gastos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hogares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "moneda" "text" DEFAULT 'USD'::"text",
    "presupuesto_mensual" numeric(12,2),
    "join_code" "text" NOT NULL,
    "creado_en" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."hogares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notificaciones" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "hogar_id" "uuid" NOT NULL,
    "usuario_id" "uuid" NOT NULL,
    "emisor_id" "uuid",
    "tipo" "text",
    "mensaje" "text" NOT NULL,
    "leida" boolean DEFAULT false,
    "metadata" "jsonb",
    "creada_en" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "notificaciones_tipo_check" CHECK (("tipo" = ANY (ARRAY['nuevo_gasto'::"text", 'presupuesto_actualizado'::"text", 'nuevo_miembro'::"text"])))
);


ALTER TABLE "public"."notificaciones" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."perfil_usuario" (
    "id" "uuid" NOT NULL,
    "nombre" "text" NOT NULL,
    "foto_url" "text",
    "creado_en" timestamp without time zone DEFAULT "now"(),
    "actualizado_en" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."perfil_usuario" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usuario_hogar" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "hogar_id" "uuid" NOT NULL,
    "rol" "text" DEFAULT 'miembro'::"text",
    "creado_en" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "usuario_hogar_rol_check" CHECK (("rol" = ANY (ARRAY['admin'::"text", 'miembro'::"text"])))
);


ALTER TABLE "public"."usuario_hogar" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."vista_gastos_extendida" AS
 SELECT "g"."id",
    "g"."descripcion",
    "g"."monto",
    "g"."categoria",
    "g"."fecha",
    "g"."creado_en",
    "g"."hogar_id",
    "g"."usuario_id",
    COALESCE(("u"."raw_user_meta_data" ->> 'displayName'::"text"), ("u"."email")::"text") AS "usuario_nombre"
   FROM ("public"."gastos" "g"
     JOIN "auth"."users" "u" ON (("g"."usuario_id" = "u"."id")));


ALTER VIEW "public"."vista_gastos_extendida" OWNER TO "postgres";


ALTER TABLE ONLY "public"."comentarios"
    ADD CONSTRAINT "comentarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."hogares"
    ADD CONSTRAINT "hogares_join_code_key" UNIQUE ("join_code");



ALTER TABLE ONLY "public"."hogares"
    ADD CONSTRAINT "hogares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."perfil_usuario"
    ADD CONSTRAINT "perfil_usuario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usuario_hogar"
    ADD CONSTRAINT "usuario_hogar_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usuario_hogar"
    ADD CONSTRAINT "usuario_hogar_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."comentarios"
    ADD CONSTRAINT "comentarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "fk_gastos_usuario" FOREIGN KEY ("usuario_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "public"."hogares"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_emisor_id_fkey" FOREIGN KEY ("emisor_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "public"."hogares"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notificaciones"
    ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."perfil_usuario"
    ADD CONSTRAINT "perfil_usuario_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usuario_hogar"
    ADD CONSTRAINT "usuario_hogar_hogar_id_fkey" FOREIGN KEY ("hogar_id") REFERENCES "public"."hogares"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usuario_hogar"
    ADD CONSTRAINT "usuario_hogar_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Miembros del hogar pueden agregar gastos" ON "public"."gastos" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "gastos"."hogar_id") AND ("uh"."user_id" = "auth"."uid"())))));



CREATE POLICY "Miembros del hogar pueden ver gastos" ON "public"."gastos" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "gastos"."hogar_id") AND ("uh"."user_id" = "auth"."uid"())))));



CREATE POLICY "Miembros pueden ver notificaciones de su hogar" ON "public"."notificaciones" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "notificaciones"."hogar_id") AND ("uh"."user_id" = "auth"."uid"())))));



CREATE POLICY "Miembros pueden ver su hogar" ON "public"."hogares" FOR SELECT TO "authenticated" USING (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Solo admin puede actualizar el hogar" ON "public"."hogares" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "hogares"."id") AND ("uh"."user_id" = "auth"."uid"()) AND ("uh"."rol" = 'admin'::"text"))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "hogares"."id") AND ("uh"."user_id" = "auth"."uid"()) AND ("uh"."rol" = 'admin'::"text")))));



CREATE POLICY "Solo el creador o admin puede eliminar gastos" ON "public"."gastos" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."usuario_hogar" "uh"
  WHERE (("uh"."hogar_id" = "gastos"."hogar_id") AND (("uh"."user_id" = "auth"."uid"()) OR ("uh"."rol" = 'admin'::"text"))))));



CREATE POLICY "Solo funciones del sistema pueden crear notificaciones" ON "public"."notificaciones" FOR INSERT WITH CHECK (false);



CREATE POLICY "Usuarios autenticados pueden crear hogar" ON "public"."hogares" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "Usuarios pueden actualizar sus propias notificaciones" ON "public"."notificaciones" FOR UPDATE USING (("usuario_id" = "auth"."uid"()));



CREATE POLICY "Usuarios pueden crear su propia relación hogar inicial" ON "public"."usuario_hogar" FOR INSERT TO "authenticated" WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "Usuarios pueden modificar su propio perfil" ON "public"."perfil_usuario" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "Usuarios pueden ver su propio perfil" ON "public"."perfil_usuario" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "Usuarios pueden ver su relación hogar" ON "public"."usuario_hogar" FOR SELECT USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."comentarios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."gastos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."hogares" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notificaciones" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."perfil_usuario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usuario_hogar" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."gastos";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."hogares";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notificaciones";



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."crear_notificacion"("hogar" "uuid", "receptor" "uuid", "emisor" "uuid", "tipo" "text", "mensaje" "text", "metadata" "jsonb") TO "anon";
GRANT ALL ON FUNCTION "public"."crear_notificacion"("hogar" "uuid", "receptor" "uuid", "emisor" "uuid", "tipo" "text", "mensaje" "text", "metadata" "jsonb") TO "authenticated";
GRANT ALL ON FUNCTION "public"."crear_notificacion"("hogar" "uuid", "receptor" "uuid", "emisor" "uuid", "tipo" "text", "mensaje" "text", "metadata" "jsonb") TO "service_role";



GRANT ALL ON FUNCTION "public"."debug_auth"() TO "anon";
GRANT ALL ON FUNCTION "public"."debug_auth"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."debug_auth"() TO "service_role";



GRANT ALL ON FUNCTION "public"."debug_auth_context"() TO "anon";
GRANT ALL ON FUNCTION "public"."debug_auth_context"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."debug_auth_context"() TO "service_role";



GRANT ALL ON FUNCTION "public"."invitar_miembro"("hogar" "uuid", "miembro" "uuid", "rol_in" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."invitar_miembro"("hogar" "uuid", "miembro" "uuid", "rol_in" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."invitar_miembro"("hogar" "uuid", "miembro" "uuid", "rol_in" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."obtener_gastos_extendidos"("hogar" "uuid", "desde" "date", "hasta" "date") TO "anon";
GRANT ALL ON FUNCTION "public"."obtener_gastos_extendidos"("hogar" "uuid", "desde" "date", "hasta" "date") TO "authenticated";
GRANT ALL ON FUNCTION "public"."obtener_gastos_extendidos"("hogar" "uuid", "desde" "date", "hasta" "date") TO "service_role";



GRANT ALL ON FUNCTION "public"."obtener_resumen_mensual"("hogar" "uuid", "mes" integer, "anio" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."obtener_resumen_mensual"("hogar" "uuid", "mes" integer, "anio" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."obtener_resumen_mensual"("hogar" "uuid", "mes" integer, "anio" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."obtener_usuarios_hogar"("hogar" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."obtener_usuarios_hogar"("hogar" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."obtener_usuarios_hogar"("hogar" "uuid") TO "service_role";


















GRANT ALL ON TABLE "public"."comentarios" TO "anon";
GRANT ALL ON TABLE "public"."comentarios" TO "authenticated";
GRANT ALL ON TABLE "public"."comentarios" TO "service_role";



GRANT ALL ON TABLE "public"."gastos" TO "anon";
GRANT ALL ON TABLE "public"."gastos" TO "authenticated";
GRANT ALL ON TABLE "public"."gastos" TO "service_role";



GRANT ALL ON TABLE "public"."hogares" TO "anon";
GRANT ALL ON TABLE "public"."hogares" TO "authenticated";
GRANT ALL ON TABLE "public"."hogares" TO "service_role";



GRANT ALL ON TABLE "public"."notificaciones" TO "anon";
GRANT ALL ON TABLE "public"."notificaciones" TO "authenticated";
GRANT ALL ON TABLE "public"."notificaciones" TO "service_role";



GRANT ALL ON TABLE "public"."perfil_usuario" TO "anon";
GRANT ALL ON TABLE "public"."perfil_usuario" TO "authenticated";
GRANT ALL ON TABLE "public"."perfil_usuario" TO "service_role";



GRANT ALL ON TABLE "public"."usuario_hogar" TO "anon";
GRANT ALL ON TABLE "public"."usuario_hogar" TO "authenticated";
GRANT ALL ON TABLE "public"."usuario_hogar" TO "service_role";



GRANT ALL ON TABLE "public"."vista_gastos_extendida" TO "anon";
GRANT ALL ON TABLE "public"."vista_gastos_extendida" TO "authenticated";
GRANT ALL ON TABLE "public"."vista_gastos_extendida" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































RESET ALL;

