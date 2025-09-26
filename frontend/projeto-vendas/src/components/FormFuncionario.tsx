import styles from "./Form.module.css"

export default function FormFuncionario() {
    return (
        <div className="min-vh-100 d-flex">
            <form>
                <div className="mb-3">
                    <label htmlFor="nomeFuncionario">Nome do Funcionário</label>
                    <input type="text" className={`form-control ${styles.formControl}`} placeholder="Nome do Funcionário" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="cargoFuncionario">Cargo Funcionário</label>
                    <select name="" id="" className={`form-select ${styles.formControl}`} required>
                        <option value="Estoquista">Estoquista</option>
                        <option value="Vendedor">Vendedor</option>
                        <option value="Gerente">Gerente</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="emailFuncionario">Email do Funcionário</label>
                    <input type="email" name="" id="emailFuncionario" className={`form-control ${styles.formControl}`} placeholder="Email do Funcionário" required />
                </div>

                <div className="mb-3">
                    <label htmlFor="telFuncionario">Telefone do Funcionário</label>
                    <input type="text" id="telFuncionario" className={`form-control ${styles.formControl}`} placeholder="Telefone ( Opcional )"  />
                </div>

                <div className="mb-3">
                    <label htmlFor="salarioFuncionario">Sálario do Funcionário</label>
                    <input type="number" id="salarioFuncionario" className={`form-control ${styles.formControl}`} step={0.01} min={1} placeholder="Sálario do Funcionário" />
                </div>

                <div className="mb-3">
                    <label htmlFor="statusFuncionario">Status do Funcionário</label>
                    <select name="" id="statusFuncionario" className={`form-select ${styles.formControl}`}>
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="fotoFuncionario">Foto do Funcionário</label>
                    <input type="file" name="" id="fotoFuncioario" />
                </div>
                <button type="button" className={`btn btn-primary`}>Cadastrar Funcionário</button>
            </form>
        </div>
    )
}