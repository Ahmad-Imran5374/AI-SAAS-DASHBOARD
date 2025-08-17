"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNotificationsPage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recipients, setRecipients] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          recipientIds: recipients
            .split(",")
            .map(id => parseInt(id.trim()))
            .filter(id => !isNaN(id)),
        }),
      });

      if (response.ok) {
        router.push("/admin");
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Send Notification</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Message</label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-2 border rounded min-h-[100px]"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Recipients (comma-separated user IDs, leave empty for all users)</label>
          <input
            type="text"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="e.g., 1, 2, 3"
          />
        </div>
        <button
          type="submit"
          disabled={isSending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send Notification"}
        </button>
      </form>
    </div>
  );
}