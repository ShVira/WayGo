import { Layout } from "../../features/layout/Layout";

export default function History() {
    return (
        <Layout>
            <div className="container py-4">
                <h1 className="fw-bold">Історія переглядів</h1>
                <p className="text-muted">Тут будуть ваші нещодавні локації.</p>
            </div>
        </Layout>
    );
}