//declaring function to create device
function createDevice({phone_name, image, detail}) {

    //changing protocol from http to https
    const arr = detail.split(":");
    arr[0] = "https";
    detail = arr.join(":");

    fetchDetails(detail); //calling function
    //fetching device through API
    async function fetchDetails(url) {
        try {
            const data = await fetch(url, {method: 'GET'});
            const result = await data.json();   
            displayDetails(result.data);   
        }
        catch (error) {
            console.log(error);
        }
    }

//Displaying device data
function displayDetails(detail) {
    const brand = (detail.brand)? detail.brand:"Unknown";
    const release_date = detail?.release_date;
    const os = detail.os;
    const price = detail.specifications.find(s=>s.title === 'Misc')?.specs.find(s => s.key === 'Price').val[0];
    const storage = detail.storage;
    //few devices didn't have camera that's why optional operator is used
    const camera = (detail.specifications.find(s => s.title === 'Main Camera')?.specs.find(s => s.key = 'Single').val[0]) ? 
    (detail.specifications.find(s => s.title === 'Main Camera')?.specs.find(s => s.key = 'Single').val[0]):"Not Available"; 
    const chipset = detail.specifications.find(s => s.title === 'Platform')?.specs.find(s => s.key === 'Chipset').val[0]; 
    const cpu = detail.specifications.find(s => s.title === 'Platform')?.specs.find(s => s.key === 'CPU').val[0];
    
    document.querySelector(".device-list").innerHTML += ``;
    document.querySelector(".device-list").innerHTML += `
    <div class="device col-xl-5 col-sm-8 col-8">
    <div class="device-name bg-dark">
        <span>${phone_name}</span>
    </div>
    <div class="device-content d-flex flex-column flex-lg-row">
        <div class="image-box col-12 col-lg-6">
            <img src="${image}" class="col-12" alt="">
        </div>
        <div class="specification-content col-12 col-lg-6">
            <table>
                <tr>
                    <td>Brand : </td>
                    <td>${brand}</td>
                </tr>
                <tr>
                    <td>Device Name: </td>
                    <td>${phone_name}</td>
                </tr>
                <tr>
                    <td>OS: </td>
                    <td>${os}</td>
                </tr>
                <tr>
                    <td>Price: </td>
                    <td>${price}</td>
                </tr>
                <tr>
                    <td>Storage: </td>
                    <td> ${storage}</td>
                </tr>
                <tr>
                    <td>Camera: </td>
                    <td>${camera}</td>
                </tr>
                <tr>
                    <td>Chipset: </td>
                    <td>${chipset}</td>
                </tr>
            </table>
        </div>
    </div>
    </div>
    `;
    }
}

//fetching devices through API
async function getData() {
    try {
        const data = await fetch("https://api-mobilespecs.azharimm.site/v2/brands/apple-phones-48?page=2", 
        {method: "GET"});
        const result = await data.json();
        const devices = result.data.phones;
    
        //Pagination
        let paginationPath = document.querySelector(".pagination");
        let devicesPerPage = 10;
        let totalPages = Math.ceil(devices.length / devicesPerPage);
        let currentPage = 1;
    
        //declaring function for slicing page data
        function slicedData(currentPage) {
            const pageDevices = devices.slice((currentPage-1)*devicesPerPage,(currentPage * devicesPerPage));
            return pageDevices;
        }
    
        pagination (totalPages, currentPage); // calling pagintion function
        
        //pagination function
        function pagination(totalPages, currentPage) {
            //creating first page button
            const firstPage = document.createElement("button");
            firstPage.innerText = "First";
            firstPage.setAttribute("class","first btn btn-secondary")
            paginationPath.append(firstPage);
            firstPage.onclick = () => {
                currentPage = 1;
                const pageData = slicedData(currentPage);
                document.querySelector(".device-list").innerHTML = "";
                pageData.forEach((device, id) => createDevice(device, id));
                previousPage.setAttribute("style", "display: none");
                    nextPage.setAttribute("style", "display: inline");
            }
            
            //Creating previous button
            const previousPage = document.createElement("button");
            previousPage.innerText = "Previous";
            previousPage.setAttribute("class","previous btn btn-secondary")
            paginationPath.append(previousPage);
            previousPage.onclick = () => {
                --currentPage;
                if(currentPage > 1) {
                    const pageData = slicedData(currentPage);
                    document.querySelector(".device-list").innerHTML = "";
                    pageData.forEach((device, id) => createDevice(device, id));
                    console.log(currentPage);
                }
                else {
                    previousPage.setAttribute("style", "display: none");
                }
                nextPage.setAttribute("style", "display: inline");
            }
            
            //creating numbered page buttons
            for(let i=1; i<=totalPages; i++) {
                const page = document.createElement("button");
                page.setAttribute("class","numberedButtons btn btn-secondary");
                page.innerText = i;
                paginationPath.append(page);
                page.onclick = () => {
                    currentPage = i;
                    console.log(slicedData(currentPage));
                    const pageData = slicedData(currentPage);
                    document.querySelector(".device-list").innerHTML = "";
                    pageData.forEach((device, id) => createDevice(device, id));
                    //logic for displaying and hiding previous and next buttons
                    if(currentPage>1) {
                        previousPage.setAttribute("style", "display: inline-block");
                    }
                    else {
                        previousPage.setAttribute("style", "display: none");
                    }
                    if(currentPage<totalPages) {
                        nextPage.setAttribute("style", "display: inline-block");
                    }
                    else {
                        nextPage.setAttribute("style", "display: none");
                    }
                }
            }
            
            //Creating next button
            const nextPage = document.createElement("button");
            nextPage.innerText = "Next";
            nextPage.setAttribute("class","next btn btn-secondary")
            paginationPath.append(nextPage);
            nextPage.onclick = () => {
                ++currentPage;
                if(currentPage<totalPages) {
                    const pageData = slicedData(currentPage);
                    document.querySelector(".device-list").innerHTML = "";
                    pageData.forEach((device, id) => createDevice(device, id));
                }
                else {
                    nextPage.setAttribute("style", "display: none");
                }
                previousPage.setAttribute("style", "display: inline");
            }
            
            //Creating last button
            const lastPage = document.createElement("button");
            lastPage.innerText = "Last";
            lastPage.setAttribute("class","last btn btn-secondary")
            paginationPath.append(lastPage);
            lastPage.onclick = () => {
                const currentPage = totalPages;
                const pageData = slicedData(currentPage);
                document.querySelector(".device-list").innerHTML = "";
                pageData.forEach((device, id) => createDevice(device, id));
                nextPage.setAttribute("style", "display: none");
                previousPage.setAttribute("style", "display: inline");
            }
    
            //Default Data to display on page
            const defaultPage =  slicedData(currentPage);
            document.querySelector(".device-list").innerHTML = "";
            defaultPage.forEach((device, id) => createDevice(device, id));
        }
    }
    catch (err) {
        console.log(err);
    }
}

getData(); //calling function getData
