import axios from "axios";

export async function fetchFinanceData() {
    return await axios
        .get('http://localhost:8000/api/finance.php')
        .then((res) => res.data);
}

export async function fetchCategories() {
    return await axios
        .get('http://localhost:8000/api/categories.php')
        .then((res) => res.data);
}

export async function fetchOverview() {
    return await axios
        .get('http://localhost:8000/api/overview.php')
        .then((res) => res.data);
}