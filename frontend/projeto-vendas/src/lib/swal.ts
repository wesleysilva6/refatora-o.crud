// src/lib/swal.ts
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Confirm genérico
export async function confirmacao({
  title,
  text,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "#0d6efd",
  cancelColor = "#6c757d",
}: {
  title: string;
  text?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
}) {
  return Swal.fire({
    title,
    text,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: confirmColor,
    cancelButtonColor: cancelColor,
  });
}

// Sucesso com cartão “bonito” (ex.: funcionário)
export async function sucessoFuncionarioCard(data: {
  nome: string;
  email?: string;
  telefone?: string;
  cargo?: string;
  status?: string;
  foto?: string; // URL pública
}) {
  const foto = data.foto ?? "/uploads/user.png";
  return Swal.fire({
    title: "Funcionário cadastrado",
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                  padding:25px;border-radius:16px;background:linear-gradient(135deg,#ffffff,#f8f9fa);
                  box-shadow:0 10px 25px rgba(0,0,0,0.12);max-width:360px;margin:0 auto;">
        <div style="width:120px;height:120px;border-radius:50%;overflow:hidden;border:4px solid #157347;
                    box-shadow:0 4px 12px rgba(0,0,0,0.2);margin-bottom:18px;">
          <img src="${foto}" alt="Foto" style="width:100%;height:100%;object-fit:cover;">
        </div>
        <h2 style="margin:0;font-size:22px;font-weight:700;color:#157347;text-align:center;">
          ${data.nome}
        </h2>
        <div style="margin-top:15px;width:100%;font-size:15px;color:#444;line-height:1.6;">
          <p style="margin:6px 0;"><strong>Email:</strong> ${data.email ?? "-"}</p>
          <p style="margin:6px 0;"><strong>Telefone:</strong> ${data.telefone ?? "-"}</p>
          <p style="margin:6px 0;"><strong>Cargo:</strong> ${data.cargo ?? "-"}</p>
          <p style="margin:6px 0;"><strong>Status:</strong> ${data.status ?? "-"}</p>
        </div>
      </div>
    `,
    icon: "success",
    confirmButtonColor: "#198754",
  });
}

// Toast rápido
export const toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2200,
});
