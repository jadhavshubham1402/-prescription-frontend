import html2pdf from "html2pdf.js";

export const filterObject = (obj) => {
  const filteredObj = {};

  for (const key in obj) {
    // Check if the value is non-null and a non-empty string
    if ([null, "", undefined].includes(obj[key])) {
      continue;
    }

    filteredObj[key] = obj[key];
  }

  return filteredObj;
};

export function formatDate(date) {
  date = new Date(date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const generatePDF = (
  doctorName,
  specialty,
  date,
  careToBeTaken,
  medicines
) => {
  const element = document.createElement("div");
  element.id = "pdf-content";
  element.style.padding = "20px";
  element.style.border = "1px solid #ddd";
  element.style.borderRadius = "8px";
  element.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
  element.style.fontFamily = "Arial, sans-serif";
  element.style.fontSize = "14px";
  element.style.color = "#333";
  element.style.maxWidth = "800px";
  element.style.margin = "0 auto";

  const formattedcareToBeTaken = careToBeTaken.replace(/\n/g, "<br>");
  const formattedMedicines = medicines.replace(/\n/g, "<br>");

  element.innerHTML = `
    <h1 style="color: #007bff; font-size: 30px; text-align: center; margin-bottom: 20px;">Prescription</h1>
    <div style="margin-bottom: 10px; padding: 10px; border-radius: 4px;">
      <strong style="color: #495057;">Doctor's Name:</strong> ${doctorName}
    </div>
    <div style="margin-bottom: 10px; padding: 10px; border-radius: 4px;">
      <strong style="color: #495057;">Specialty:</strong> ${specialty}
    </div>
    <div style="margin-bottom: 10px; padding: 10px; border-radius: 4px;">
      <strong style="color: #495057;">Date:</strong> ${date}
    </div>
    <div style="margin-bottom: 20px;">
      <strong style="color: #007bff; margin-bottom: 20px;">Care to be Taken:</strong>
      <p style="background: #f8f9fa;  margin-top: 20px; height: 200px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">${formattedcareToBeTaken}</p>
    </div>
    <div>
      <strong style="color: #007bff; margin-bottom: 20px;">Medicines:</strong>
      <ul style="background: #f8f9fa;  margin-top: 20px;  height: 200px; padding: 10px; border: 1px solid #e0e0e0; border-radius: 4px;">
        ${formattedMedicines}
      </ul>
    </div>
  `;
  // Append the element to the body
  document.body.appendChild(element);

  if (!element) {
    console.error('Element with ref "pdfContentRef" not found');
    return;
  }

  const options = {
    margin: 1,
    filename: "Prescription.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
  };

  html2pdf()
    .from(element)
    .set(options)
    .save()
    .then(() => {
      // Remove the element after the PDF has been saved
      document.body.removeChild(element);
    })
    .catch((error) => {
      console.error("Error generating PDF:", error);
      // Remove the element even if there's an error
      document.body.removeChild(element);
    });
};

export const formatHeader = (key, isFirstWordCapital = false) => {
  if (!key) return key;

  // Split the key by capital letters or underscore
  const words = key.split(/(?=[A-Z])|_/);

  // Capitalize the first letter of each word
  let formattedKey = words
    .map((word, index) => {
      if (index === 0 && isFirstWordCapital && words?.length > 1)
        return word.toUpperCase();
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  return formattedKey;
};
