window.onload = () => {
    let mexButton = document.getElementById('mexicobut')
    let mexDiv = document.getElementById('mexico')
    mexButton.onclick = () => {
        mexDiv.style.backgroundColor = "purple"
        console.log("clicking!!!!!")
    }
}