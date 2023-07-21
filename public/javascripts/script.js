const audio1 = document.createElement("audio");
  audio1.src = "../audio/select.mp3";

window.onload = () => {
    function applyAnimation(element) {
        audio1.play();
        element.style.animation = "do 1.5s ease-in infinite";
        element.style.border = "solid silver";
        element.style.borderRadius = "100%";
        element.style.content = "";
    }
    
    function removeAnimation(element) {
        element.style.animation = "";
        element.style.border = "none";
        element.style.borderRadius = "";
    }

    function applyAnimation2(element) {
        element.style.borderBottom =  "1px solid black";
        element.style.transition= "0.3s ease background";
    }
    
    function removeAnimation2(element) {
        element.style.borderBottom = "1px solid white";
        element.style.transition= "0.3s ease background";
    }
    
    function setupButtonAnimation(buttonId, divId) {
        const button = document.getElementById(buttonId);
        const div = document.getElementById(divId);
    
        button.addEventListener('mouseover', () => applyAnimation(div));
        button.addEventListener('mouseout', () => removeAnimation(div));
        div.addEventListener('mouseover', () => applyAnimation2(button));
        div.addEventListener('mouseout', () => removeAnimation2(button));
    }
    
    const buttonDivPairs = [
        ['mexicobut', 'mexico'],
        ['miamibut', 'miami'],
        ['racoonbut', 'racoon'],
        ['denverbut', 'denver'],
        ['catarinabut', 'catarina'],
        ['brasilbut', 'brasil'],
        ['lyonbut', 'lyon'],
        ['berlinbut', 'berlin'],
        ['kyivbut', 'kyiv'],
        ['capebut', 'cape'],
        ['delhibut', 'delhi'],
        ['shanghaibut', 'shanghai'],
        ['tokyobut', 'tokyo'],
        ['sydneybut', 'sydney'],
    ];
    
    buttonDivPairs.forEach(pair => {
        const [buttonId, divId] = pair;
        setupButtonAnimation(buttonId, divId);
    });

}