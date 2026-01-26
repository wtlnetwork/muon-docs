let data = [];
let sortKey = "title";
let sortAsc = true;

fetch("./gameinfo/supported_games.json")
  .then(r => r.json())
  .then(json => {
    data = json;
    render();
  });
  
function qrIcon() {
  return svgIcon(
    `<path stroke-linecap="round" stroke-linejoin="round" 
      d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
     <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />`,
    "text-slate-400 group-hover:text-blue-400 transition-colors"
  );
}

function svgIcon(svgPath, classes) {
  return `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-5 h-5 ${classes}"
      aria-hidden="true"
      focusable="false"
    >
      ${svgPath}
    </svg>
  `;
}

function stateIcon(state) {
  if (state === "supported") {
    return `
      <span class="inline-flex items-center" aria-label="Supported" title="Supported">
        ${svgIcon(
          `<path stroke-linecap="round" stroke-linejoin="round"
            d="M9 12.75 11.25 15 15 9.75
               M21 12a9 9 0 1 1-18 0
               9 9 0 0 1 18 0Z" />`,
          "text-green-400"
        )}
        <span class="sr-only">Supported</span>
      </span>
    `;
  }

  if (state === "unsupported") {
    return `
      <span class="inline-flex items-center" aria-label="Unsupported" title="Unsupported">
        ${svgIcon(
          `<path stroke-linecap="round" stroke-linejoin="round"
            d="M18.364 18.364A9 9 0 0 0 5.636 5.636
               m12.728 12.728A9 9 0 0 1 5.636 5.636
               m12.728 12.728L5.636 5.636" />`,
          "text-red-400"
        )}
        <span class="sr-only">Unsupported</span>
      </span>
    `;
  }

  if (state === "informational") {
    return `
      <span class="inline-flex items-center" aria-label="Informational" title="Informational">
        ${svgIcon(
          `<path stroke-linecap="round" stroke-linejoin="round"
            d="M12 9v3.75
               m-9.303 3.376c-.866 1.5.217 3.374
               1.948 3.374h14.71c1.73 0
               2.813-1.874 1.948-3.374
               L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0
               L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />`,
          "text-yellow-400"
        )}
        <span class="sr-only">Informational</span>
      </span>
    `;
  }

  return "";
}

function rowClass(state) {
  if (state === "supported") {
    return "bg-green-950/40 hover:bg-green-950/60";
  }
  if (state === "unsupported") {
    return "bg-red-950/40 hover:bg-red-950/60";
  }
  if (state === "informational") {
    return "bg-yellow-950/40 hover:bg-yellow-950/60";
  }
  return "hover:bg-slate-900";
}

function prettyState(state) {
  if (state === "supported") return "Supported";
  if (state === "unsupported") return "Unsupported";
  if (state === "informational") return "Informational";
  return state;
}

function stateClass(state) {
  if (state === "supported") return "text-green-400";
  if (state === "unsupported") return "text-red-400";
  if (state === "informational") return "text-yellow-400";
  return "";
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function render() {
  const search = document.getElementById("search").value.toLowerCase();
  const state = document.getElementById("stateFilter").value;

  const rows = data
    .filter(g =>
      (!state || g.state === state) &&
      g.title.toLowerCase().includes(search)
    )
    .sort((a, b) => {
      const x = a[sortKey].toLowerCase();
      const y = b[sortKey].toLowerCase();
      return sortAsc ? x.localeCompare(y) : y.localeCompare(x);
    });

  const tbody = document.getElementById("rows");
  tbody.innerHTML = "";

  rows.forEach((g, index) => {
    const tr = document.createElement("tr");
    tr.className = rowClass(g.state);

    tr.innerHTML = `
      <td class="px-4 py-2" data-label="Title">
        <div class="font-medium title-text">
          ${g.title}
        </div>
        <div class="mt-1 text-sm text-slate-400 leading-relaxed print:text-black print:text-xs">
          ${escapeHtml(g.notes).replace(/\n/g, "<br>")}
        </div>
      </td>

      <td class="px-4 py-2 text-center" data-label="State">
        ${stateIcon(g.state)}
      </td>

      <td class="px-4 py-2" data-label="Link">
        <div class="flex items-center gap-3 print:hidden">
          <a
            href="${g.link}"
            target="_blank"
            rel="noopener"
            class="text-blue-400 hover:underline text-sm font-medium"
          >
            Open Steam
          </a>
          <button 
            onclick="openQR('${g.link}')"
            class="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Show QR Code"
            aria-label="Show QR Code"
          >
            ${qrIcon()}
          </button>
        </div>
        <div id="print-qr-${index}" class="hidden print-qr-container"></div>
      </td>
    `;
    tbody.appendChild(tr);
    new QRCode(document.getElementById(`print-qr-${index}`), {
      text: g.link,
      width: 128,
      height: 128,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.L
    });
  });
}

document.getElementById("search").addEventListener("input", render);
document.getElementById("stateFilter").addEventListener("change", render);

document.querySelectorAll("button[data-sort]").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.sort;
    sortAsc = key === sortKey ? !sortAsc : true;
    sortKey = key;
    render();
  });
});

let qrCodeObj = null;

function openQR(link) {
  const modal = document.getElementById("qrModal");
  const container = document.getElementById("qrcode");
  
  container.innerHTML = "";
  
  modal.classList.remove("hidden");
  
  qrCodeObj = new QRCode(container, {
    text: link,
    width: 180,
    height: 180,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.M
  });
}

function closeModal() {
  const modal = document.getElementById("qrModal");
  modal.classList.add("hidden");
}

document.getElementById("qrModal").addEventListener("click", (e) => {
  if (e.target.id === "qrModal") {
    closeModal();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !document.getElementById("qrModal").classList.contains("hidden")) {
    closeModal();
  }
});