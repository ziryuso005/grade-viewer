const subjects = [
    { name: "Effective Communication", term1: 88, term2: 90, term3: 91},
    { name: "Mabisang Komunikasyon", term1:87, term2: 89, term3: 90},
    { name: "General Science", term1: 85, term2: 88, term3: 90},
    { name: "General Mathematics", term1:80, term2:82, term3:85},
    { name: "Life and Career Skills", term1: 80, term2: 91, term3: 92},
    { name: "Pag-aaral ng Kasaysayan at Lipunang Pilipino", term1:86, term2:87, term3: 88},
    { name: "Introduction to Philosophy", term1: 84, term2: 86, term3: 88}
];

function calculateAverage(term1, term2, term3) {
    return((term1+term2+term3)/3).toFixed(1);
}

function renderGrades() {
    const tbody = document.getElementById("grades-body");
    tbody.innerHTML ="";

    const ec = subjects.find(subject => subject.name === "Effective Communication");
    const mk = subjects.find(subject => subject.name === "Mabisang Komunikasyon");
    const ecAverage = calculateAverage(ec.term1, ec.term2, ec.term3);
    const mkAverage = calculateAverage(mk.term1, mk.term2,mk.term3);
    const combinedAverage = ((Number(ecAverage)+ Number(mkAverage))/ 2).toFixed(1);
    const term1Average = ((ec.term1+mk.term1)/2).toFixed(1);
    const term2Average = ((ec.term2+mk.term2)/2).toFixed(1);
    const term3Average = ((ec.term3+mk.term3)/2).toFixed(1);

    const combinedRow = `
        <tr>
            <td>Effective Communication/Mabisang Komunikasyon</td>
            <td>${term1Average}</td>
            <td>${term2Average}</td>
            <td>${term3Average}</td>
            <td>${combinedAverage}</td>
        </tr>
    `;
    tbody.innerHTML += combinedRow;

    subjects.forEach(subject => {
        const average = calculateAverage(subject.term1, subject.term2, subject.term3);
        const row= `
            <tr>
                <td>${subject.name}</td>
                <td>${subject.term1}</td>
                <td>${subject.term2}</td>
                <td>${subject.term3}</td>
                <td class="${Number(average) >= 75 ? 'passing': 'failing'}">${average}</td>
            </tr>
        `;
        tbody.innerHTML += row;
        
    });
}

renderGrades();