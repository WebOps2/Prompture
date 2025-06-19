import { supabase } from "@/lib/supabase-client";
import { useEffect, useState } from "react";


const useUser = () => {
    const [user, setUser] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const {data} = await supabase.auth.getUser();
            if (data?.user) {
                const fullName = data.user.user_metadata.full_name;
                setUser(fullName || null);
                setEmail(data.user.email || null);
            }
            if (!data?.user) {
                setUser('User');
                setEmail(null);
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    return {user, email, loading};
};

export default useUser;