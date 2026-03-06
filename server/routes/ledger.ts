import { Router } from "express";
import { createClient } from "@supabase/supabase-js";

const router = Router();
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

router.post("/save", async (req, res) => {
  const { userId, protocol, responses, completedAt } = req.body;
  if (!userId || !protocol || !responses) {
    return res.status(400).json({ error: "Missing userId, protocol, or responses" });
  }
  const { data, error } = await supabase
    .from("living_ledger_entries")
    .insert({
      user_id: userId,
      protocol_type: protocol,
      responses,
      completed_at: completedAt,
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true, id: data?.id });
});

export { router as ledgerRouter };
