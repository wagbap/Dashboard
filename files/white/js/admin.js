addEventListener("load", updateInterface);

//atualizar interface ao iniciar
function updateInterface() {
  setInitialData();
  getData();
  printData();
  totalCourse();
  countSold();
  countSoldCash()
}

let editingProductId = null;

//copy all db data to local storage
function setInitialData() {
  let dbData;
  if (localStorage.getItem("dbKey")) {
    if (localStorage.getItem("dbKey") == "[]") {
      dbData = localStorage.setItem("dbKey", JSON.stringify(courses));
    }
    dbData = JSON.parse(localStorage.getItem("dbKey"));
  }  else {
  dbData = localStorage.setItem("dbKey", JSON.stringify(courses));
}
return dbData;
}

//load data from local storage
function getData() {
  let dbData = JSON.parse(localStorage.getItem("dbKey") || "[]");
  return dbData;
}

//read all data from local storage to drowCards()

function printData() {
  let dbData = getData();
  let table = document.getElementById("listData");
  table.innerHTML = "";
  let html = "";
  //run all data from dbData and show them in html
  for (let i = 0; i < dbData.length; i++) {
    let dbItem = dbData[i];
    html += `
    <tr>
                  <td>
                    <img
                      alt="..."
                      src="${dbItem.imagem}"
                      class="avatar avatar-sm rounded-circle me-2"
                    />
                    <a class="text-heading font-semibold" href="#">
                    ${dbItem.titulo}
                    </a>
                  </td>
                  <td>${dbItem.autor}</td>
                  <td>
                  <span class="badge badge-lg badge-dot">
                      <i class="bg-success"></i> ${dbItem.categoria}
                    </span>
                  </td>
                  <td>${dbItem.preco}</td>
                  <td>
                    ${dbItem.promocao}
                  </td>
                  <td class="text-end">
                    <button
                      type="button"
                      class="btn btn-sm btn-square btn-neutral text-danger-hover"
                      id="submitEdit" onclick="fillFormForEdit(${dbItem.ISBN})"
                    >
                      <i class="bi bi-pencil"></i>
                    </button>

                    <button
                      type="button"
                      class="btn btn-sm btn-square btn-neutral text-danger-hover"
                      id="clearProduct" onclick="removeProduct(${dbItem.ISBN}); updateInterface(); printData()"
                    >
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
    `;
    // console.log(dbItem.titulo);
  }
  table.innerHTML = html;

  saveData(dbData);
}
// save data to local storage
function saveData(data) {
  localStorage.setItem("dbKey", JSON.stringify(data));
}

// Função para adicionar um novo produto
function addData(titulo, autor, categoria, preco, promocao, rating, imagem) {
  const data = getData();
  let dataLength = data.length + 1;
  const newCourse = {
    ISBN: dataLength,
    titulo,
    autor,
    categoria,
    preco,
    promocao,
    rating,
    imagem,
  };
  data.push(newCourse);
  saveData(data);
}
// Função para adicionar um novo produto
function editData(ISBN, titulo, autor, categoria, preco, promocao,
  rating,
  imagem
) {
  const dbData = getData();
  const findCourse = dbData.findIndex((dataCourse) => dataCourse.ISBN === ISBN);
  if (findCourse !== -1) {
    dbData[findCourse].titulo = titulo;
    dbData[findCourse].autor = autor;
    dbData[findCourse].categoria = categoria;
    dbData[findCourse].preco = preco;
    dbData[findCourse].promocao = promocao;
    dbData[findCourse].rating = rating;
    dbData[findCourse].imagem = imagem;
    saveData(dbData);
  }
}

// Função para salvar a imagem no localStorage e retornar a URL
function saveImage(imageFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const imageUrl = event.target.result;
      resolve(imageUrl);
    };
    reader.onerror = function (event) {
      reject(event.target.error);
    };
    reader.readAsDataURL(imageFile);
  });
}

// Event listener para o formulário de adição/editar de produtos
const courseForm = document.getElementById("courseForm");
courseForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let tituloInputt = document.getElementById("titulo");
  let autorInputt = document.getElementById("autor");
  let categoriaInputt = document.getElementById("categoria");
  let precoInputt = document.getElementById("preco");
  let promocaoInputt = document.getElementById("promocao");
  let ratingInputt = document.getElementById("rating");
  let imageInputt = document.getElementById("imageInput");

  const titulo = tituloInputt.value;
  const autor = autorInputt.value;
  const categoria = categoriaInputt.value;
  const preco = parseFloat(precoInputt.value);
  const promocao = parseFloat(promocaoInputt.value);
  const rating = parseInt(ratingInputt.value);
  const imageFile = imageInputt.files[0];

  if (editingProductId) {
    editData(editingProductId, titulo, autor, categoria, preco, promocao, rating, imageFile ? await saveImage(imageFile) : "");
    clearForm();
    printData();
  } else {
    addData(titulo, autor, categoria, preco, promocao, rating, imageFile ? await saveImage(imageFile) : "");
    clearForm();
    printData();
    totalCourse();
  }

  tituloInputt.value = "";
  autorInputt.value = "";
  categoriaInputt.value = "";
  precoInputt.value = "";
  promocaoInputt.value = "";
  ratingInputt.value = "";
  imageInputt.value = "";
});

// Função para preencher o formulário com os dados de um produto para edição
function fillFormForEdit(id) {
  const dbData = getData();
  const findCourse = dbData.find((dataCourse) => dataCourse.ISBN === id);
  if (findCourse) {
    let tituloInputt = document.getElementById("titulo");
    let autorInputt = document.getElementById("autor");
    let categoriaInputt = document.getElementById("categoria");
    let precoInputt = document.getElementById("preco");
    let promocaoInputt = document.getElementById("promocao");
    let ratingInputt = document.getElementById("rating");
    let imageInputt = document.getElementById("imageInput");
    const submitButton = document.getElementById("submitButton");
    const cancelButton = document.getElementById("cancelButton");

    tituloInputt.value = findCourse.titulo;
    autorInputt.value = findCourse.autor;
    categoriaInputt.value = findCourse.categoria;
    precoInputt.value = findCourse.preco;
    promocaoInputt.value = findCourse.promocao;
    ratingInputt.value = findCourse.rating;
    imageInputt.value = "";
    submitButton.textContent = "Salvar";
    cancelButton.style.display = "inline-block";

    editingProductId = id;
  }
}

//função para remover um produto da base de dados ao clickar no botão limpar
function removeProduct(id) {
  const dbData = getData();
  const findCourse = dbData.find((dataCourse) => dataCourse.ISBN === id);
  if (findCourse) {
    dbData.splice(dbData.indexOf(findCourse), 1);
    saveData(dbData);
    printData();
    totalCourse();
  }
} 

// Função para limpar o formulário e redefinir para adição de novos produtos
function clearForm() {
    let tituloInputt = document.getElementById("titulo");
    let autorInputt = document.getElementById("autor");
    let categoriaInputt = document.getElementById("categoria");
    let precoInputt = document.getElementById("preco");
    let promocaoInputt = document.getElementById("promocao");
    let ratingInputt = document.getElementById("rating");
    let imageInputt = document.getElementById("imageInput");
    const submitButton = document.getElementById("submitButton");
    const cancelButton = document.getElementById("cancelButton");

    tituloInputt.value = '';
    autorInputt.value = '';
    categoriaInputt.value = '';
    precoInputt.value = '';
    promocaoInputt.value = '';
    ratingInputt.value = '';
    imageInputt.value = '';
    submitButton.textContent = 'Adicionar';
    cancelButton.style.display = 'none';

  editingProductId = null;
}

// Função para contar o total de cursos registrados
function totalCourse() {
  let contarCurso = document.getElementById("total");
  const dbData = getData();
  let total = 0;
  for (let i = 0; i < dbData.length; i++) {
    total++;
  }
  contarCurso.textContent = total;
  printData();
  return total;
}
// contar o total de produtos vendidos
function countSold() {
  let data = JSON.parse(localStorage.getItem("soldKey") || "[]");;
  let contador = 0;
   for (let i = 0; i < data.length; i++){
    contador += data[i].quantity;
    }
    document.getElementById("sold").textContent = contador;
    printData();
    return contador;
}
// contar o total do valor vendido
function countSoldCash() {
  let data = JSON.parse(localStorage.getItem("soldKey") || "[]");;
  let contador = 0;
   for (let i = 0; i < data.length; i++){
    contador += data[i].totalPrice;
    }
    document.getElementById("totalPrice").textContent = contador;
    printData();
    return contador;
}


