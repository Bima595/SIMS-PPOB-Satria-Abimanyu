import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
    const cookieStore = await cookies(); // Tambahkan await di sini
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect("/auth/login");
    }

    redirect("/dashboard");
}
