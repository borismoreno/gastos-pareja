drop function if exists "public"."obtener_usuarios_hogar"(hogar uuid);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.obtener_usuarios_hogar(hogar uuid)
 RETURNS TABLE(user_id uuid, email text, display_name text, foto_url text, rol text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
  RETURN QUERY
  SELECT 
    u.id AS user_id,
    u.email::text,  -- 👈 conversión explícita
    COALESCE(
      pf.nombre,
      u.raw_user_meta_data->>'displayName',
      u.raw_user_meta_data->>'display_name',
      u.raw_user_meta_data->>'full_name',
      u.email::text
    ) AS display_name,
    pf.foto_url::text,
    uh.rol::text
  FROM usuario_hogar uh
  JOIN auth.users u ON u.id = uh.user_id
  LEFT JOIN perfil_usuario pf ON pf.id = u.id
  WHERE uh.hogar_id = hogar
  ORDER BY uh.rol, display_name;
END;$function$
;

grant delete on table "public"."comentarios" to "anon";

grant insert on table "public"."comentarios" to "anon";

grant references on table "public"."comentarios" to "anon";

grant select on table "public"."comentarios" to "anon";

grant trigger on table "public"."comentarios" to "anon";

grant truncate on table "public"."comentarios" to "anon";

grant update on table "public"."comentarios" to "anon";

grant delete on table "public"."comentarios" to "authenticated";

grant insert on table "public"."comentarios" to "authenticated";

grant references on table "public"."comentarios" to "authenticated";

grant select on table "public"."comentarios" to "authenticated";

grant trigger on table "public"."comentarios" to "authenticated";

grant truncate on table "public"."comentarios" to "authenticated";

grant update on table "public"."comentarios" to "authenticated";

grant delete on table "public"."comentarios" to "service_role";

grant insert on table "public"."comentarios" to "service_role";

grant references on table "public"."comentarios" to "service_role";

grant select on table "public"."comentarios" to "service_role";

grant trigger on table "public"."comentarios" to "service_role";

grant truncate on table "public"."comentarios" to "service_role";

grant update on table "public"."comentarios" to "service_role";

grant delete on table "public"."gastos" to "anon";

grant insert on table "public"."gastos" to "anon";

grant references on table "public"."gastos" to "anon";

grant select on table "public"."gastos" to "anon";

grant trigger on table "public"."gastos" to "anon";

grant truncate on table "public"."gastos" to "anon";

grant update on table "public"."gastos" to "anon";

grant delete on table "public"."gastos" to "authenticated";

grant insert on table "public"."gastos" to "authenticated";

grant references on table "public"."gastos" to "authenticated";

grant select on table "public"."gastos" to "authenticated";

grant trigger on table "public"."gastos" to "authenticated";

grant truncate on table "public"."gastos" to "authenticated";

grant update on table "public"."gastos" to "authenticated";

grant delete on table "public"."gastos" to "service_role";

grant insert on table "public"."gastos" to "service_role";

grant references on table "public"."gastos" to "service_role";

grant select on table "public"."gastos" to "service_role";

grant trigger on table "public"."gastos" to "service_role";

grant truncate on table "public"."gastos" to "service_role";

grant update on table "public"."gastos" to "service_role";

grant delete on table "public"."hogares" to "anon";

grant insert on table "public"."hogares" to "anon";

grant references on table "public"."hogares" to "anon";

grant select on table "public"."hogares" to "anon";

grant trigger on table "public"."hogares" to "anon";

grant truncate on table "public"."hogares" to "anon";

grant update on table "public"."hogares" to "anon";

grant delete on table "public"."hogares" to "authenticated";

grant insert on table "public"."hogares" to "authenticated";

grant references on table "public"."hogares" to "authenticated";

grant select on table "public"."hogares" to "authenticated";

grant trigger on table "public"."hogares" to "authenticated";

grant truncate on table "public"."hogares" to "authenticated";

grant update on table "public"."hogares" to "authenticated";

grant delete on table "public"."hogares" to "service_role";

grant insert on table "public"."hogares" to "service_role";

grant references on table "public"."hogares" to "service_role";

grant select on table "public"."hogares" to "service_role";

grant trigger on table "public"."hogares" to "service_role";

grant truncate on table "public"."hogares" to "service_role";

grant update on table "public"."hogares" to "service_role";

grant delete on table "public"."notificaciones" to "anon";

grant insert on table "public"."notificaciones" to "anon";

grant references on table "public"."notificaciones" to "anon";

grant select on table "public"."notificaciones" to "anon";

grant trigger on table "public"."notificaciones" to "anon";

grant truncate on table "public"."notificaciones" to "anon";

grant update on table "public"."notificaciones" to "anon";

grant delete on table "public"."notificaciones" to "authenticated";

grant insert on table "public"."notificaciones" to "authenticated";

grant references on table "public"."notificaciones" to "authenticated";

grant select on table "public"."notificaciones" to "authenticated";

grant trigger on table "public"."notificaciones" to "authenticated";

grant truncate on table "public"."notificaciones" to "authenticated";

grant update on table "public"."notificaciones" to "authenticated";

grant delete on table "public"."notificaciones" to "service_role";

grant insert on table "public"."notificaciones" to "service_role";

grant references on table "public"."notificaciones" to "service_role";

grant select on table "public"."notificaciones" to "service_role";

grant trigger on table "public"."notificaciones" to "service_role";

grant truncate on table "public"."notificaciones" to "service_role";

grant update on table "public"."notificaciones" to "service_role";

grant delete on table "public"."perfil_usuario" to "anon";

grant insert on table "public"."perfil_usuario" to "anon";

grant references on table "public"."perfil_usuario" to "anon";

grant select on table "public"."perfil_usuario" to "anon";

grant trigger on table "public"."perfil_usuario" to "anon";

grant truncate on table "public"."perfil_usuario" to "anon";

grant update on table "public"."perfil_usuario" to "anon";

grant delete on table "public"."perfil_usuario" to "authenticated";

grant insert on table "public"."perfil_usuario" to "authenticated";

grant references on table "public"."perfil_usuario" to "authenticated";

grant select on table "public"."perfil_usuario" to "authenticated";

grant trigger on table "public"."perfil_usuario" to "authenticated";

grant truncate on table "public"."perfil_usuario" to "authenticated";

grant update on table "public"."perfil_usuario" to "authenticated";

grant delete on table "public"."perfil_usuario" to "service_role";

grant insert on table "public"."perfil_usuario" to "service_role";

grant references on table "public"."perfil_usuario" to "service_role";

grant select on table "public"."perfil_usuario" to "service_role";

grant trigger on table "public"."perfil_usuario" to "service_role";

grant truncate on table "public"."perfil_usuario" to "service_role";

grant update on table "public"."perfil_usuario" to "service_role";

grant delete on table "public"."usuario_hogar" to "anon";

grant insert on table "public"."usuario_hogar" to "anon";

grant references on table "public"."usuario_hogar" to "anon";

grant select on table "public"."usuario_hogar" to "anon";

grant trigger on table "public"."usuario_hogar" to "anon";

grant truncate on table "public"."usuario_hogar" to "anon";

grant update on table "public"."usuario_hogar" to "anon";

grant delete on table "public"."usuario_hogar" to "authenticated";

grant insert on table "public"."usuario_hogar" to "authenticated";

grant references on table "public"."usuario_hogar" to "authenticated";

grant select on table "public"."usuario_hogar" to "authenticated";

grant trigger on table "public"."usuario_hogar" to "authenticated";

grant truncate on table "public"."usuario_hogar" to "authenticated";

grant update on table "public"."usuario_hogar" to "authenticated";

grant delete on table "public"."usuario_hogar" to "service_role";

grant insert on table "public"."usuario_hogar" to "service_role";

grant references on table "public"."usuario_hogar" to "service_role";

grant select on table "public"."usuario_hogar" to "service_role";

grant trigger on table "public"."usuario_hogar" to "service_role";

grant truncate on table "public"."usuario_hogar" to "service_role";

grant update on table "public"."usuario_hogar" to "service_role";