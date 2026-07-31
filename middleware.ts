import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseConfigured =
        supabaseUrl && supabaseUrl !== 'https://placeholder-project.supabase.co' &&
        supabaseAnonKey && supabaseAnonKey !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

    if (supabaseConfigured) {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        });

        const { data: { user } } = await supabase.auth.getUser();

        if (request.nextUrl.pathname.startsWith('/admin')) {
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .maybeSingle();

                if (!profile || profile.role !== 'admin') {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            }
        }
    }

    return supabaseResponse;
}

export async function middleware(request: NextRequest) {
    return await updateSession(request);
}

export const config = {
    matcher: ['/admin/:path*'],
};
