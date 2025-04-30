import bodyParser from 'body-parser';
import express from 'express';
import PDFDocument from 'pdfkit';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)


const app = express();
const PORT = 3000;


app.use(bodyParser.json());
app.use(express.static("certificates"))

if (!fs.existsSync("certificates")) {
    fs.mkdirSync("certificates");
}

app.post("/generate-certificate", (req, res) => {
    const { register_id, email, phoneNumber, address, name, dob, gender, bloodGroup, dateTime
    } = req.body;

    const doc = new PDFDocument();
    const filename = `${name.replace(" ", "_")}_certificate.pdf`;
    const filePath = path.join(__dirname, 'certificates', filename);

    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(20).text("Certificate of Half Marathon", { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text("This Certificate Presented to", { align: "center" });
    doc.moveDown();
    doc.text(name, { align: "center" });
    doc.moveDown(2);
    doc.fontSize(15).text("The certificate of achievement is awarded to individuals who have demonstrated outstanding performance in their field. Here’s an example text for a certificate.", { align: 'center' });
    doc.moveDown(3);

    doc.text(`Registerd-Id: ${register_id}`);
    doc.text(`Email:${email}`);
    doc.text(`Phone No: ${phoneNumber}`);
    doc.text(`Address:${address}`);
    doc.text(`Date of Birth:${dob}`);
    doc.text(`Gender:${gender}`);
    doc.text(`Blood Group:${bloodGroup}`);
    doc.text(`Date-Time:${dateTime}`);
    doc.moveDown(3);


    doc.text("SIGNATURE", { align: "center" });
    doc.end();

    res.json({
        message: "Certificated Generated",
        file: `/certificates/${filename}`
    })
})

app.listen(PORT, () => {
    console.log(`Server is started at ${PORT}`);

})