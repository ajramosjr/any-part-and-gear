useEffect(() => {
  async function loadMessages() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setUserIdSelf(user.id);

    // Load messages
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`
      )
      .order("created_at");

    setMessages(data || []);

    // ✅ MARK AS READ
    await supabase
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("sender_id", userId)
      .eq("receiver_id", user.id)
      .is("read_at", null);
  }

  loadMessages();
}, [userId]);
