"use client"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email({ message: "invalid email" }),
    password: z.string().min(5, { message: "password must be at least 6 characters" }),
});

export function SigninForm() {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onSubmit",
        defaultValues: {
            email: "",
            password: "",
        }
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        const loadId = toast.loading("Signing In...");
        try {
            const res = await signIn('credentials', {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            toast.dismiss(loadId);
            if (!res?.error) {
                router.push('/home');
                toast.success("Signed In");
            } else {
                if (res.status === 401) {
                    toast.error('Invalid Credentials, try again!');
                } else if (res.status === 400) {
                    toast.error('Missing Credentials!');
                } else if (res.status === 404) {
                    toast.error('Account not found!');
                } else if (res.status === 403) {
                    toast.error('Forbidden!');
                } else {
                    toast.error('oops something went wrong..!');
                }
            }
        }
        catch (e) {
            toast.dismiss(loadId);
            console.log(e)
            toast.error('oops something went wrong..!');
        }
    }

    return <div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="py-1">Email</FormLabel>
                            <FormControl>
                                <Input className="bg-gray-200 " placeholder="example@gmail.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="pb-1">Password</FormLabel>
                            <FormControl>
                                <Input className="bg-background" placeholder="********" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full mt-1" type="submit">Submit</Button>
            </form>
        </Form>
    </div>
}