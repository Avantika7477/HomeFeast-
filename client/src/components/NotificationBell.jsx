import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import Hint from "./Hint";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  async function load() {
    try {
      const data = await api("/api/notifications");
      setItems(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      setItems([]);
      setUnreadCount(0);
    }
  }

  useEffect(() => {
    load();
    const timer = setInterval(load, 30000);
    return () => clearInterval(timer);
  }, []);

  async function markRead(id) {
    await api(`/api/notifications/${id}/read`, { method: "PATCH" });
    load();
  }

  async function markAllRead() {
    await api("/api/notifications/read-all", { method: "PATCH" });
    load();
  }

  return (
    <div className="relative">
      <Hint text="Open your latest order and subscription updates.">
        <button
          type="button"
          className="relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-ink/15 bg-white text-lg hover:bg-sand"
          onClick={() => setOpen((v) => !v)}
          aria-label="Notifications"
        >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        </button>
      </Hint>
      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-30 cursor-default"
            aria-label="Close notifications"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-3 right-3 z-40 mt-2 max-h-[min(24rem,calc(100dvh-5.5rem))] overflow-hidden rounded-2xl border border-ink/10 bg-white p-3 shadow-lg sm:absolute sm:left-auto sm:right-0 sm:w-80">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-semibold">Notifications</p>
              {unreadCount > 0 && (
                <Hint text="Mark every notification as already seen.">
                  <button type="button" className="text-xs text-clay" onClick={markAllRead}>
                    Mark all read
                  </button>
                </Hint>
              )}
            </div>
            <div className="max-h-[min(20rem,calc(100dvh-8rem))] space-y-2 overflow-y-auto">
              {items.length ? (
                items.map((note) => (
                  <div
                    key={note._id}
                    className={`rounded-xl border p-3 text-sm ${note.read ? "border-ink/5 bg-cream/40" : "border-clay/20 bg-sand/40"}`}
                  >
                    <p className="font-semibold">{note.title}</p>
                    <p className="mt-1 text-ink/70">{note.message}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {note.link && (
                        <Hint text="Open the related order or subscription page.">
                          <Link
                            className="text-xs font-semibold text-clay"
                            to={note.link}
                            onClick={() => {
                              if (!note.read) markRead(note._id);
                              setOpen(false);
                            }}
                          >
                            View
                          </Link>
                        </Hint>
                      )}
                      {!note.read && (
                        <Hint text="Keep this notification but mark it as seen.">
                          <button
                            type="button"
                            className="text-xs text-ink/50"
                            onClick={() => markRead(note._id)}
                          >
                            Mark read
                          </button>
                        </Hint>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-sm text-ink/50">No notifications yet.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
