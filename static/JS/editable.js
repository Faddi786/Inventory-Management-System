window.onload = function() {
    fetch('/get_session_data')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.error) {
                console.error('Error:', data.error);
                return;
            }
            document.querySelector('input[name="name"]').value = data.Name;
            document.querySelector('input[name="id"]').value = data.ID;
            document.querySelector('input[name="project"]').value = data.Project;
            document.querySelector('input[name="designation"]').value = data.TypeOfAccount;
            adjustButtonsVisibility(data);


        })
        .catch(error => console.error('Error:', error));
}

