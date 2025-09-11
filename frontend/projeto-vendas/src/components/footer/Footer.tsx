import logoFooter from "../../assets/img/fundop.png"

export default function Footer() {
return (
    <footer className="py-4">
        <div className="logoFooter d-flex justify-content-center">
            <img src={logoFooter} alt="logo" width={200} height={200} />
        </div>
    </footer>
    );
}
