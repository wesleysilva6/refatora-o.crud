import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import styles from "./Analytics.module.css";
import { Bar } from "react-chartjs-2";
import { api } from "../api"; // ajuste o caminho conforme seu projeto
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Analytics() {
    const [dias, setDias] = useState<string[]>([]);
    const [qtds, setQtds] = useState<number[]>([]);
    const [resumo, setResumo] = useState<{ total: number; valor: number }>({ total: 0, valor: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            const { data } = await api.get("/analytics"); // Seu endpoint Laravel
            setDias(data.dias);
            setQtds(data.qtds);
            setResumo({ total: data.total, valor: data.valor });
            setLoading(false);
        }
        fetchData();
    }, []);

    const dataSimulacoesDia = {
        labels: dias,
        datasets: [
            {
                label: "Simulações",
                data: qtds,
                backgroundColor: "#0d6efd",
            },
        ],
    };

    const dataResumo = {
        labels: ["Total de Simulações", "Valor Total (R$)"],
        datasets: [
            {
                label: "Resumo",
                data: [resumo.total, resumo.valor],
                backgroundColor: ["#198754", "#ffc107"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
    };

    return (
        <div className="min-vh-100 d-flex flex-column">
            <Sidebar />

                <h2 className="dashboard-title text-center mt-5" style={{ fontWeight: 600 }}>
                    📊 Analytics Geral
                </h2>
            <div className={`container ${styles.dashboardContainer}`}>

                <div className="row g-4 justify-content-center">
                    <div className="col-md-6">
                        <div className={`card ${styles.card}`}>
                            <h5 className="text-center mt-3">Simulações por Dia</h5>
                            <Bar data={dataSimulacoesDia} options={options} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className={`card ${styles.card}`}>
                            <h5 className="text-center mt-3">Resumo Geral</h5>
                            <Bar data={dataResumo} options={options} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}