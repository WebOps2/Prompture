import { supabase } from "@/lib/supabase-client";

const fetchUser = async () => {
    const { data } = await supabase.auth.getUser();
    if (data?.user) {
        const fullName = data.user.user_metadata.full_name;
        return fullName || null;
        // setName(fullName);
    }
    return null;
}

export default fetchUser;