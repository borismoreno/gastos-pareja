
set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.crear_perfil_usuario_automatico()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- Insertar un nuevo perfil cuando se crea un usuario en auth.users
  INSERT INTO public.perfil_usuario (id, nombre, foto_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.obtener_usuarios_hogar(hogar uuid)
 RETURNS TABLE(user_id uuid, email text, display_name text, rol text)
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
    uh.rol::text
  FROM usuario_hogar uh
  JOIN auth.users u ON u.id = uh.user_id
  LEFT JOIN perfil_usuario pf ON pf.id = u.id
  WHERE uh.hogar_id = hogar
  ORDER BY uh.rol, display_name;
END;$function$
;