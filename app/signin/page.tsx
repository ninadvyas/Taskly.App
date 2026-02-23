import { signIn } from "@/auth";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
    return (
        <div className="h-screen flex items-center justify-center bg-background">
            <div className="w-full max-w-md flex flex-col items-center gap-8 p-10 border rounded-2xl shadow-sm bg-card">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome to Taskly</h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to manage your tasks and sync with Google Calendar
                    </p>
                </div>

                <form
                    action={async () => {
                        "use server";
                        await signIn("google", { redirectTo: "/" });
                    }}
                    className="w-full"
                >
                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-3 border rounded-lg py-3 px-4 text-sm font-medium hover:bg-muted transition-colors"
                    >
                        <FcGoogle className="h-5 w-5" />
                        Continue with Google
                    </button>
                </form>

                <p className="text-xs text-muted-foreground text-center">
                    By signing in, you agree to allow Taskly to access your Google
                    Calendar to sync tasks you choose.
                </p>
            </div>
        </div>
    );
}
