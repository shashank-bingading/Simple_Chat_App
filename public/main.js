const socket = io("http://localhost:3000");

socket.on("clients-connected", (data) => {
  console.log(data);
});

const countInput = document.getElementById("client-total");
const messageContainer = document.getElementById("message-container");
const nameInput = document.getElementById("name-input");
const messageInput = document.getElementById("message-input");
const messageForm = document.getElementById("message-form");

messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage();
});

const sendMessage = () => {
  if (messageInput.value === "") return;

  const data = {
    name: nameInput.value,
    message: messageInput.value,
    dateTime: new Date(),
  };
  socket.emit("message", data);
  addmessageToUI(true, data);
  messageInput.value = "";
};

socket.on("clients-connected", (data) => {
  countInput.innerText = `Connected Users:${data}`;
});

socket.on("chat-message", (data) => {
  addmessageToUI(false, data);
});

const addmessageToUI = (isOwnMessage, data) => {
  deletefeedback();
  const element = `<li class="${
    isOwnMessage ? "message-right" : "message-left"
  }">
          <p class="message">
            ${data.message}
            <span>${data.name} ● ${moment(data.dateTime).fromNow()}</span>
          </p>
        </li>`;
  messageContainer.innerHTML += element;
  scrollAlways();
};

const scrollAlways = () => {
  messageContainer.scrollTo(0, messageContainer.scrollHeight);
};

messageInput.addEventListener("focus", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});
messageInput.addEventListener("keypress", (e) => {
  socket.emit("feedback", {
    feedback: `${nameInput.value} is typing...`,
  });
});

socket.on("feedback", (data) => {
  deletefeedback();
  const element = `<li class="message-feedback">
          <p class="feedback" id="feedback">✍️ ${data.feedback}</p>
        </li>`;
  messageContainer.innerHTML += element;
});

const deletefeedback = () => {
  document.querySelectorAll("li.message-feedback").forEach((element) => {
    element.parentNode.removeChild(element);
  });
};
