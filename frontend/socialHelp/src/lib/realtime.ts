import { supabase } from "./supabase";
import { eventBus } from "./eventBus";

let initialized = false;

export function startRealtime() {
  if (initialized) return;

  initialized = true;

  supabase
    .channel("volunteers-global")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "volunteers",
      },
      (payload) => {
        eventBus.emit("volunteer:new", payload.new);
      }
    )
    .subscribe();
}