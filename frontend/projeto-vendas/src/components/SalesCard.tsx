import styles from "../pages/Dashboard.module.css";

type Props = {
    title: string;
    value: string;
    subtitle?: string;
    tone?: "primary" | "success" | "warning" | "danger";
    icon?: React.ReactNode;
};

export default function SalesCard({
    title,
    value,
    subtitle,
    tone = "primary",
    icon,
}: Props) {
return (
    <div className={styles.cardSales} data-tone={tone}>
        <div className={styles.salesHeader}>
            <span className={styles.salesTitle}>{title}</span>
            <span className={styles.salesIcon}>{icon ?? <i className="bi bi-cash-stack" />}</span>
        </div>

        <div className={styles.salesValue}>{value}</div>

        {subtitle && (
            <div className={styles.salesFooter}>
            <span className={`badge rounded-pill ${styles.salesBadge}`}>{subtitle}</span>
            </div>
        )}
    </div>
);
}
