function db(code,fn){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", '/call-serverdb', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.onreadystatechange = function (x) { // Call a function when the state changes.
            if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
                fn(JSON.parse(xhr.responseText));
            }
        }
        xhr.send(JSON.stringify({'text':code}));
}

function dbEnd(){
    var xhr = new XMLHttpRequest();
        xhr.open("POST", '/call-serverenddb', true);

        //Send the proper header information along with the request
        xhr.setRequestHeader("Content-type", "application/json");

        xhr.send(JSON.stringify({'end':"true"}));
}