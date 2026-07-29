import { useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabase-client';
import { UserProfile } from '@/types';

const ADMIN_EMAIL = 'nour@chefnour.com';

/**
 * Fetches the Supabase `profiles` row for a given auth user id.
 * Returns null if not found.
 */
export async function fetchProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error || !data) return null;

    return {
        id: data.id,
        full_name: data.full_name || 'مستخدم',
        email: '',       // filled by caller from auth.user.email
        avatar_url: data.avatar_url || undefined,
        role: data.role || 'user',
        created_at: data.created_at,
    };
}

/**
 * Sign in with Supabase Auth. Returns the UserProfile on success.
 * Throws a human-readable Arabic error string on failure.
 */
export async function supabaseSignIn(
    email: string,
    password: string
): Promise<UserProfile> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
        throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    }

    const profile = await fetchProfile(data.user.id);

    if (!profile) {
        // No profile row yet — create a minimal one
        const { error: insertError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: data.user.email?.split('@')[0] || 'مستخدم',
            role: data.user.email === ADMIN_EMAIL ? 'admin' : 'user',
        });
        if (insertError) console.warn('Profile insert failed:', insertError.message);

        return {
            id: data.user.id,
            full_name: data.user.email?.split('@')[0] || 'مستخدم',
            email: data.user.email || email,
            role: data.user.email === ADMIN_EMAIL ? 'admin' : 'user',
            created_at: new Date().toISOString(),
        };
    }

    return { ...profile, email: data.user.email || email };
}

/**
 * Sign up with Supabase Auth + insert a profiles row.
 * Throws a human-readable Arabic error string on failure.
 */
export async function supabaseSignUp(
    email: string,
    password: string,
    fullName: string
): Promise<{ needsEmailConfirmation: boolean }> {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
        if (error.message.includes('already registered')) {
            throw new Error('هذا البريد مسجل مسبقاً — يمكنك تسجيل الدخول');
        }
        throw new Error('حدث خطأ أثناء إنشاء الحساب، حاول مجدداً');
    }

    if (data.user) {
        // Insert profiles row immediately
        await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            role: 'user',
        });
    }

    // Supabase may require email confirmation depending on project settings
    const needsEmailConfirmation = !data.session;
    return { needsEmailConfirmation };
}

/**
 * Sign out the current Supabase session.
 */
export async function supabaseSignOut(): Promise<void> {
    if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
    }
}

/**
 * Resolves the current Supabase session into a UserProfile or null.
 * Used on app mount to restore auth state.
 */
export async function resolveCurrentSession(): Promise<UserProfile | null> {
    if (!isSupabaseConfigured()) return null;

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;

    const profile = await fetchProfile(session.user.id);
    if (!profile) return null;

    return { ...profile, email: session.user.email || '' };
}
