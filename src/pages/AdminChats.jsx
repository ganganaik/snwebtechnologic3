
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const ADMIN_UID = "fLYo9QeSqFZCI4sORKo0rIJXMh33";

function AdminChats() {
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeChats = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        window.location.href = "/admin-login";
        setChecking(false);
        return;
      }

      setAuthorized(true);

      const chatsQuery = query(
        collection(db, "chats"),
        orderBy("updatedAt", "desc"),
        limit(100)
      );

      unsubscribeChats = onSnapshot(
        chatsQuery,
        (snapshot) => {
          const chatList = snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }));

          setChats(chatList);
          setLoadingChats(false);
          setError("");
        },
        (err) => {
          console.error(err);
          setError("Unable to load customer chats.");
          setLoadingChats(false);
        }
      );

      setChecking(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeChats) unsubscribeChats();
    };
  }, []);

  useEffect(() => {
    if (!selectedChat?.id || !authorized) {
      setMessages([]);
      return;
    }

    const messagesQuery = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("createdAt", "asc"),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
      },
      (err) => {
        console.error(err);
        setError("Unable to load this conversation.");
      }
    );

    return () => unsubscribe();
  }, [selectedChat?.id, authorized]);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !selectedChat || sending) return;

    try {
      setSending(true);
      setError("");

      await addDoc(
        collection(db, "chats", selectedChat.id, "messages"),
        {
          text,
          senderUid: ADMIN_UID,
          senderRole: "admin",
          createdAt: serverTimestamp(),
        }
      );

      await updateDoc(doc(db, "chats", selectedChat.id), {
        lastMessage: text,
        updatedAt: serverTimestamp(),
      });

      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Message could not be sent. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return "Sending...";
    return timestamp.toDate().toLocaleString();
  };

  if (checking) {
    return <div style={styles.center}>Checking admin access...</div>;
  }

  if (!authorized) return null;

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <span style={styles.eyebrow}>SN WEB TECHNOLOGIES</span>
          <h1 style={styles.title}>Customer Chats</h1>
        </div>
        <Link to="/admin" style={styles.backButton}>
          ← Admin Dashboard
        </Link>
      </header>

      {error && <div style={styles.error}>{error}</div>}

      <main style={styles.layout}>
        <aside style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Conversations</h2>

          {loadingChats ? (
            <p style={styles.muted}>Loading customers...</p>
          ) : chats.length === 0 ? (
            <p style={styles.muted}>No customer conversations yet.</p>
          ) : (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setError("");
                }}
                style={{
                  ...styles.chatItem,
                  ...(selectedChat?.id === chat.id
                    ? styles.activeChat
                    : {}),
                }}
              >
                <strong>
                  {chat.customerName || "Customer"}
                </strong>
                <span style={styles.email}>
                  {chat.customerEmail || "No email"}
                </span>
                <span style={styles.preview}>
                  {chat.lastMessage || "No messages"}
                </span>
              </button>
            ))
          )}
        </aside>

        <section style={styles.conversation}>
          {!selectedChat ? (
            <div style={styles.empty}>
              <span style={{ fontSize: "45px" }}>💬</span>
              <h2>Select a Conversation</h2>
              <p>Choose a customer from the list to view messages.</p>
            </div>
          ) : (
            <>
              <div style={styles.conversationHeader}>
                <div>
                  <h2>{selectedChat.customerName || "Customer"}</h2>
                  <p>{selectedChat.customerEmail || "No email"}</p>
                </div>
              </div>

              <div style={styles.messages}>
                {messages.length === 0 ? (
                  <p style={styles.muted}>No messages yet.</p>
                ) : (
                  messages.map((item) => {
                    const isAdmin = item.senderRole === "admin";

                    return (
                      <div
                        key={item.id}
                        style={{
                          ...styles.messageRow,
                          justifyContent: isAdmin
                            ? "flex-end"
                            : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            ...styles.bubble,
                            ...(isAdmin
                              ? styles.adminBubble
                              : styles.customerBubble),
                          }}
                        >
                          <strong style={styles.sender}>
                            {isAdmin ? "You (Admin)" : "Customer"}
                          </strong>
                          <p style={styles.messageText}>{item.text}</p>
                          <span style={styles.time}>
                            {formatTime(item.createdAt)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form onSubmit={handleSend} style={styles.form}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Reply to customer..."
                  maxLength={2000}
                  style={styles.input}
                  disabled={sending}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || sending}
                  style={styles.sendButton}
                >
                  {sending ? "Sending..." : "Send ➤"}
                </button>
              </form>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#f8f5ed",
    fontFamily: "Arial, sans-serif",
    padding: "25px 16px",
  },
  header: {
    maxWidth: "1200px",
    margin: "0 auto 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "15px",
  },
  eyebrow: {
    color: "#d4af37",
    fontSize: "11px",
    letterSpacing: "2px",
  },
  title: {
    color: "#e5c45f",
    margin: "8px 0",
  },
  backButton: {
    color: "#d4af37",
    textDecoration: "none",
    border: "1px solid #d4af37",
    padding: "10px 14px",
    borderRadius: "7px",
  },
  layout: {
    maxWidth: "1200px",
    margin: "auto",
    display: "grid",
    gridTemplateColumns: "minmax(230px, 320px) minmax(0, 1fr)",
    gap: "18px",
  },
  sidebar: {
    background: "#141414",
    border: "1px solid #514326",
    borderRadius: "12px",
    padding: "15px",
    minWidth: 0,
  },
  sidebarTitle: {
    color: "#e5c45f",
    fontSize: "18px",
    margin: "5px 0 15px",
  },
  chatItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width: "100%",
    padding: "13px",
    marginBottom: "9px",
    background: "#080808",
    color: "#fff",
    border: "1px solid #39301c",
    borderRadius: "8px",
    textAlign: "left",
    cursor: "pointer",
    gap: "6px",
  },
  activeChat: {
    border: "1px solid #d4af37",
    background: "#211b0d",
  },
  email: {
    color: "#d4af37",
    fontSize: "11px",
    overflowWrap: "anywhere",
  },
  preview: {
    color: "#aaa69d",
    fontSize: "12px",
    overflowWrap: "anywhere",
  },
  conversation: {
    background: "#141414",
    border: "1px solid #514326",
    borderRadius: "12px",
    minWidth: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: "600px",
  },
  conversationHeader: {
    padding: "17px",
    background: "#1b180f",
    borderBottom: "1px solid #514326",
  },
  messages: {
    flex: 1,
    minHeight: "400px",
    maxHeight: "520px",
    overflowY: "auto",
    padding: "18px",
  },
  messageRow: {
    display: "flex",
    marginBottom: "14px",
  },
  bubble: {
    maxWidth: "82%",
    padding: "12px",
    borderRadius: "10px",
    overflowWrap: "anywhere",
  },
  adminBubble: {
    background: "#3a3018",
    border: "1px solid #8b7130",
  },
  customerBubble: {
    background: "#222",
    border: "1px solid #444",
  },
  sender: {
    color: "#e5c45f",
    fontSize: "11px",
  },
  messageText: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.5,
    fontSize: "14px",
    margin: "7px 0",
  },
  time: {
    color: "#aaa69d",
    fontSize: "10px",
  },
  form: {
    display: "flex",
    gap: "10px",
    padding: "14px",
    borderTop: "1px solid #39301c",
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: "13px",
    background: "#080808",
    color: "#fff",
    border: "1px solid #514326",
    borderRadius: "8px",
  },
  sendButton: {
    padding: "12px 16px",
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
  },
  empty: {
    margin: "auto",
    padding: "25px",
    textAlign: "center",
    color: "#aaa69d",
  },
  muted: {
    color: "#aaa69d",
    fontSize: "13px",
  },
  error: {
    maxWidth: "1200px",
    margin: "0 auto 15px",
    padding: "12px",
    color: "#ffaaaa",
    background: "#351515",
    borderRadius: "8px",
  },
  center: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#080808",
    color: "#d4af37",
  },
};

export default AdminChats;
