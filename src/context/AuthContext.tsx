import { createContext, useEffect, useState, useContext, type ReactNode } from 'react'
import { supabase } from '../config/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import type { PerfilUsuario } from '../services/perfilUsuarioService';

type AuthContextType = {
    session: Session | null;
    user: User | null
    rol: 'admin' | 'miembro' | null;
    perfilUsuario: PerfilUsuario | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; data?: any; error?: any }>;
    signOut: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: any } | void>;
    exchangeCodeForSession: (url: string) => Promise<{ success: boolean; data?: any; error?: any } | void>;
    isEmailRegistered: (email: string) => Promise<{ isRegistered: boolean; isVerified: boolean }>;
    updatePerfilUsuario: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthContextProvider = ({ children }: { children: ReactNode }) => {

    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null)
    const [rol, setRol] = useState<'admin' | 'miembro' | null>(null)
    const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario | null>(null)

    const signUp = async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { displayName: name },
                emailRedirectTo: `${window.location.origin}/verificado`,
            }
        });

        if (error) {
            console.error('Hubo un problema', error)
            return { success: false, error: error.message };
        }

        if (data.user && (!data.user.user_metadata || !('email' in data.user.user_metadata))) {
            return { success: false, error: 'Usuario ya registrado' };
        }

        return { success: true, data };
    }

    useEffect(() => {
        setLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null)
            setLoading(false);
        })

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null)
            setLoading(false);
        })

        return () => listener.subscription.unsubscribe()
    }, [])

    const obtenerPerfilUsuario = async () => {
        if (!user) {
            setPerfilUsuario(null);
            setLoading(false);
            return
        }

        const { data, error } = await supabase
            .from('perfil_usuario')
            .select('*')
            .eq('id', user.id)
            .maybeSingle<PerfilUsuario>()

        if (error) {
            console.error('Error obteniendo perfil usuario:', error)
            setPerfilUsuario(null)
        } else {
            setPerfilUsuario(data ?? null)
        }

        setLoading(false)
    }

    // 🔹 Obtener el rol desde la tabla usuario_hogar
    useEffect(() => {
        const obtenerRol = async () => {
            if (!user) {
                setRol(null)
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from('usuario_hogar')
                .select('rol')
                .eq('user_id', user.id)
                .maybeSingle()

            if (error) {
                console.error('Error obteniendo rol:', error)
                setRol(null)
            } else {
                setRol(data?.rol ?? null)
            }

            setLoading(false)
        }

        obtenerRol()
        obtenerPerfilUsuario()
    }, [user])

    const updatePerfilUsuario = async () => {
        await obtenerPerfilUsuario();
    }

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Hubo un error', error);
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) {
                console.error('Hubo un problema', error)
                if (error.message.includes('Email not confirmed'))
                    return { success: false, error: 'Correo electrónico no verificado.' };
                if (error.message.includes('Invalid login credentials'))
                    return { success: false, error: 'Correo electrónico o contraseña inválidos.' };
                else
                    return { success: false, error: error.message };
            }

            return { success: true, data };
        } catch (error) {
            console.error('Hubo un error', error);
        }
    }

    const exchangeCodeForSession = async (url: string) => {
        try {
            console.log('url', url);
            if (url.includes('#access_token=')) {
                const params = Object.fromEntries(new URLSearchParams(url.split('#')[1]))
                const { access_token, refresh_token } = params
                if (access_token) {
                    const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
                    if (error) {
                        console.error('Hubo un problema exchange', error)
                        return { success: false, error: error.message };
                    }

                    return { success: true, data };
                }
            }
            else {
                const { data, error } = await supabase.auth.exchangeCodeForSession(url);
                if (error) {
                    console.error('Hubo un problema exchange', error)
                    return { success: false, error: error.message };
                }

                return { success: true, data };
            }
        } catch (error) {
            console.error('Hubo un error', error);
        }
    }

    const isEmailRegistered = async (email: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password: 'dummy'
        });
        console.log('error?.message', error?.message);
        if (error?.message === 'Invalid login credentials' || error?.message?.includes('Email not confirmed')) {
            return { isRegistered: true, isVerified: error?.message === 'Invalid login credentials' };
        }
        // If no error, assume not registered
        return { isRegistered: false, isVerified: false };
    }

    const contextValue: AuthContextType = {
        session,
        user,
        rol,
        perfilUsuario,
        loading,
        updatePerfilUsuario,
        signIn, signUp, signOut, exchangeCodeForSession, isEmailRegistered
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useMyContext must be used within a MyContextProvider');
    }
    return context;
}