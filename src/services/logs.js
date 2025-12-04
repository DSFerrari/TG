import { supabase } from '../services/supabase';

export async function logAction(acao, contexto = {}) {
  try {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id ?? null;

    await supabase.from('logs_app').insert({
      usuario_id: userId,
      acao,
      contexto,
    });
  } catch (e) {
  }
}
