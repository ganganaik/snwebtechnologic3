
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";

function CustomerChat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let unsubscribeMessages = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        window.location.href = "/customer-login";
        return;
      }

      setUser(currentUser);

      const messagesQuery = query(
        collection(db, "chats", currentUser.uid, "messages"),
        orderBy("createdAt", "asc"),
        limit(100)
      );

      unsubscribeMessages = onSnapshot(
        messagesQuery,
        (snapshot) => {
          setMessages(
            snapshot.docs.map((item) => ({
              id: item.id,
              ...item.data(),
            }))
          );
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error(err);
          setError("Unable to load chat. Please try again.");
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeMessages) unsubscribeMessages();
    };
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !user || sending) return;

    try {
      setSending(true);
      setError("");

      await setDoc(
        doc(db, "chats", user.uid),
        {
          customerUid: user.uid,
          customerEmail: user.email || "",
          customerName: user.displayName || "Customer",
          lastMessage: text,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await addDoc(
        collection(db, "chats", user.uid, "messages"),
        {
          text,
          senderUid: user.uid,
          senderRole: "customer",
          createdAt: serverTimestamp(),
        }
      );

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

  const renderMessageText = (text) => {
    const parts = text.split(/(https?:\/\/[^\s]+)/g);

    return parts.map((part, index) => {
      if (/^https?:\/\//i.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.messageLink}
          >
            {part}
          </a>
        );
      }

      return part;
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <span style={styles.eyebrow}>CUSTOMER SUPPORT</span>
            <h1 style={styles.title}>Live Customer Chat</h1>
            <p style={styles.subtitle}>
              Chat directly with SN WEB TECHNOLOGIES.
            </p>
          </div>
          <span style={styles.icon}>💬</span>
        </div>

        <div style={styles.chatBox}>
          <div style={styles.chatHeader}>
            <span style={styles.onlineDot}></span>
            <div>
              <strong>SN WEB TECHNOLOGIES</strong>
              <p>Customer Support</p>
            </div>
          </div>

          <div style={styles.messages}>
            {loading ? (
              <p style={styles.infoText}>Loading messages...</p>
            ) : messages.length === 0 ? (
              <div style={styles.empty}>
                <span>👋</span>
                <h3>Start a Conversation</h3>
                <p>
                  Send us a message about your project, order,
                  payment or any question.
                </p>
              </div>
            ) : (
              messages.map((item) => {
                const isMine = item.senderUid === user?.uid;

                return (
                  <div
                    key={item.id}
                    style={{
                      ...styles.messageRow,
                      justifyContent: isMine ? "flex-end" : "flex-start",
                    }}
                  >
                    <div
                      style={{
                        ...styles.bubble,
                        ...(isMine ? styles.myBubble : styles.adminBubble),
                      }}
                    >
                      <span style={styles.sender}>
                        {isMine ? "You" : "SN Support"}
                      </span>
                      <p style={styles.messageText}>
                        {renderMessageText(item.text || "")}
                      </p>
                      <span style={styles.time}>
                        {formatTime(item.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSend} style={styles.form}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              maxLength={2000}
              disabled={!user || sending}
              style={styles.input}
            />
            <button
              type="submit"
              disabled={!message.trim() || sending || !user}
              style={styles.sendButton}
            >
              {sending ? "Sending..." : "Send ➤"}
            </button>
          </form>

          <p style={styles.note}>
            Your conversation is private to your account and our authorised admin.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#080808",
    color: "#f8f5ed",
    padding: "35px 16px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "850px",
    margin: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    marginBottom: "25px",
  },
  eyebrow: {
    color: "#d4af37",
    fontSize: "11px",
    letterSpacing: "2px",
    fontWeight: "bold",
  },
  title: {
    color: "#e5c45f",
    fontSize: "28px",
    margin: "10px 0",
  },
  subtitle: {
    color: "#aaa69d",
    fontSize: "14px",
  },
  icon: {
    fontSize: "42px",
  },
  chatBox: {
    background: "#141414",
    border: "1px solid #514326",
    borderRadius: "14px",
    overflow: "hidden",
  },
  chatHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "18px",
    background: "#1b180f",
    borderBottom: "1px solid #514326",
  },
  onlineDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#4ade80",
  },
  messages: {
    height: "420px",
    overflowY: "auto",
    padding: "20px 15px",
  },
  infoText: {
    textAlign: "center",
    color: "#d4af37",
  },
  empty: {
    textAlign: "center",
    padding: "90px 15px",
    color: "#aaa69d",
  },
  messageRow: {
    display: "flex",
    marginBottom: "15px",
  },
  bubble: {
    maxWidth: "82%",
    padding: "12px 14px",
    borderRadius: "12px",
    overflowWrap: "anywhere",
  },
  myBubble: {
    background: "#3a3018",
    border: "1px solid #8b7130",
  },
  adminBubble: {
    background: "#222222",
    border: "1px solid #444",
  },
  sender: {
    color: "#e5c45f",
    fontSize: "11px",
    fontWeight: "bold",
  },
  messageText: {
    color: "#fff",
    fontSize: "14px",
    lineHeight: 1.5,
    margin: "7px 0",
    whiteSpace: "pre-wrap",
  },
  messageLink: {
    color: "#e5c45f",
    textDecoration: "underline",
    overflowWrap: "anywhere",
  },
  time: {
    color: "#aaa69d",
    fontSize: "10px",
  },
  error: {
    margin: "0 15px 12px",
    padding: "10px",
    color: "#ffaaaa",
    background: "#351515",
    borderRadius: "7px",
    fontSize: "12px",
  },
  form: {
    display: "flex",
    gap: "10px",
    padding: "15px",
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
    outline: "none",
  },
  sendButton: {
    padding: "12px 18px",
    background: "#d4af37",
    color: "#080808",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  note: {
    color: "#969187",
    fontSize: "11px",
    textAlign: "center",
    padding: "0 12px 15px",
  },
};

export default CustomerChat;
