document.addEventListener('deviceready', loadContacts, false);

var id_old;

function createContact(){
    const phoneNumbers1 = document.getElementById('Number01').value;
    const phoneNumbers2 = document.getElementById('Number02').value;
    const email1 = document.getElementById('E-mail1').value;
    const email2 = document.getElementById('E-mail2').value;
    const addresse = document.getElementById('Addresse').value;
    
    var infosContact ={
        //get infos form
        name:{
            givenName: document.getElementById('FirstName').value,
            familyName: document.getElementById('LastName').value
        },
        // displayName : document.getElementById('FirstName').value + ' ' + document.getElementById('LastName').value,
        nickName : document.getElementById('NickName').value,
        phoneNumbers : [],
        emails : [],
        organization : document.getElementById('Organization').value,
        addresses : [],
    };

    if(phoneNumbers1){
        infosContact.phoneNumbers.push({type : 'work',value: document.getElementById('Number01').value});
    }
    if(phoneNumbers2){
        infosContact.phoneNumbers.push({type : 'mobile',value: document.getElementById('Number02').value});
    }
    if(email1){
        infosContact.emails.push({type : 'work',value: document.getElementById('E-mail1').value});
    }
    if(email2){
        infosContact.emails.push({type : 'other',value: document.getElementById('E-mail2').value});
    }
    if(addresse){
        infosContact.addresses.push(new ContactAddress('', '', '', '', '', addresse, true));
    }

    if (infosContact.name && infosContact.phoneNumbers){
        var contact = navigator.contacts.create(infosContact);
        contact.save(registerContactSuccess("crée", "page-contact-list"), handleContactError);
        document.contactForm.reset();
    }
}

function loadContacts(){
    let options = new ContactFindOptions();
    options.multiple = true;
    options.hasPhoneNumber = true;

    let fields = ['name'];

    navigator.contacts.find(fields, showContacts, handleContactError, options);
    
    // Ajoutez un événement au bouton pour retourner à l'accueil
    let boutonAccueil = document.getElementById('home');
    boutonAccueil.addEventListener('click', function(){
        urlAccueil = 'http://example.com/accueil-android';  
        // Ouvrir l'écran d'accueil dans le navigateur in-app
        cordova.InAppBrowser.open(urlAccueil, '_system');
        });
}

function showContacts(contacts){
    let contactItem;
    const contactList = document.getElementById('contactList');

    for (const contact of contacts) {
        contactItem = document.createElement('li');
        contactItem.innerHTML += `
            <a href="#page-contact-details">
                <img src="img/Image5.png" alt="contact">
                <h4><i>${contact.name.formatted}</i></h2>
                <h5><p><b>${contact.phoneNumbers[0].value}</b></p></h5>
            </a>
        `;

        contactItem.onclick = function( ){
            getContact(contact.id);
        }

        contactList.appendChild(contactItem);
    }
    
    $(contactList).listview('refresh');
}

function getContact(contactId){
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, showContact, handleContactError, options);
}

function showContact(contacts){
    const contact = contacts[0];

    const contactDetail = document.getElementById('contactDetail');
    const deleteContact = document.getElementById('deleteContact');
    const editContact = document.getElementById('iconEditContact');

    let contactInfo = 
        `
        <li>
            <img src="img/Image4.png" alt="contact">
            <h1>Nom du Contact</h1>
            <p>${contact.name.formatted}</p>
        </li>

        <li>
            <h1>Téléphone</h1>
            <p>${contact.phoneNumbers[0].value} (mobile)</p>
        </li>
        <li>
            <h1>Adresse</h1>
            <p>${contact.addresses ? contact.addresses[0].formatted :'Non renseigne'}</p>
        </li>
        <li>
            <h1>E-mail</h1>
            <p>${contact.emails ? contact.emails[0].value :'Non renseigne'}</p>
        </li>
        <li>
            <h1>Organisation</h1>
            <p>${contact.organization ? contact.organization[0].value :'Non renseigne'}</p>
        </li>
        `;

    contactDetail.innerHTML = contactInfo;
    $(contactDetail).listview('refresh');

    deleteContact.onclick = function(){
        getContactDelete(contact.id);
    };

    editContact.onclick = function(){
        id_old = contact.id;
        alert("id : " + id_old);
    };
}

function toEditContact(){
    let options = new ContactFindOptions();
    options.filter = id_old;
    options.multiple = false;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, updateContact, handleContactError, options);

    function updateContact(contacts){
        if (contacts.length > 0) {
            var contact = contacts[0];

            const editPhoneNumbers1 = document.getElementById('editNumber01').value;
            const editPhoneNumbers2 = document.getElementById('editNumber02').value;
            const editEmail1 = document.getElementById('editE-mail1').value;
            const editEmail2 = document.getElementById('editE-mail2').value;
            const editAddresse = document.getElementById('editAddresse').value;
            
            var infosEditContact ={
                name:{
                    givenName: document.getElementById('editFirstName').value,
                    familyName: document.getElementById('editLastName').value
                },
                nickName : document.getElementById('editNickName').value,
                phoneNumbers : [],
                emails : [],
                organization : document.getElementById('editOrganization').value,
                addresses : [],
            };

            if(editPhoneNumbers1){
                infosEditContact.phoneNumbers.push({type : 'work',value: editPhoneNumbers1});
            }
            if(editPhoneNumbers2){
                infosEditContact.phoneNumbers.push({type : 'mobile',value: editPhoneNumbers2});
            }
            if(editEmail1){
                infosEditContact.emails.push({type : 'work',value: editEmail1});
            }
            if(editEmail2){
                infosEditContact.emails.push({type : 'other',value: editEmail2});
            }
            if(editAddresse){
                infosEditContact.addresses.push(new ContactAddress('', '', '', '', '', editAddresse, true));
            }
            
            if (infosEditContact.phoneNumbers){
                infosEditContact.id = contact.id;
                contact.name = infosEditContact.name;
                contact.nickName = infosEditContact.nickName;
                contact.organization = infosEditContact.organization;
                contact.phoneNumbers = infosEditContact.phoneNumbers;
                contact.emails = infosEditContact.emails;
                contact.addresses = infosEditContact.addresses;
                
                contact.save(registerContactSuccess("modifié", "page-contact-list"), handleContactError);
                document.contactFormEdit.reset();
                location.reload();
            }
        }else{
            alert("Contact non trouvé");
        }
    }
}

function getContactDelete(contactId){
    let options = new ContactFindOptions();
    options.filter = contactId;
    options.hasPhoneNumber = true;

    let fields = ['id'];

    navigator.contacts.find(fields, contactfindSuccess, handleContactError, options);

    function contactfindSuccess(contacts) {
        if (contacts.length > 0) {
            var contact = contacts[0];
            let answer = confirm('Are you sure you want to delete this?');
            if (answer){
                contact.remove(contactRemoveSuccess, contactRemoveError);
            }
        } else {
            alert("Contact non trouvé");
        }
        
       function contactRemoveSuccess() {
            alert("Contact supprimé avec succès");
            window.location.href = '#page-contact-list';
            location.reload();
       }
 
       function contactRemoveError(message) {
          alert('Echec de suppression: ' + message);
       }
    }     
}

function registerContactSuccess(msg, redirectPage){
    alert("Contact " + msg + " avec succès");
    window.location.href="#" + redirectPage;
    location.reload();
}

function handleContactError(error){
    console.log("Erreur lors de l'obtention de la liste des contacts");
    console.log(error);
}
