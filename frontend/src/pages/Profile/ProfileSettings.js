import React, { useEffect, useState } from 'react';
import LogoLight from "../../asset/logo_light.png";
import './ProfileSettings.css';

const translations = {
    english: {
        editProfile: "Edit Profile",
        personalInfo: "Personal info",
        userName: "User Name:",
        companyName: "Company Name:",
        email: "Email:",
        submitButton: "Submit",
        updateSuccess: "Updated successfully",
        fetchError: "Failed to fetch users",
        updateError: "Failed to update user",
        noUserFound: "No matching user found",
    },
    german: {
        editProfile: "Profil bearbeiten",
        personalInfo: "Persönliche Informationen",
        userName: "Benutzername:",
        companyName: "Firmenname:",
        email: "E-Mail:",
        submitButton: "Einreichen",
        updateSuccess: "Erfolgreich aktualisiert",
        fetchError: "Benutzer konnten nicht abgerufen werden",
        updateError: "Benutzer konnte nicht aktualisiert werden",
        noUserFound: "Kein passender Benutzer gefunden",
    },
    czech: {
        editProfile: "Upravit profil",
        personalInfo: "Osobní údaje",
        userName: "Uživatelské jméno:",
        companyName: "Název společnosti:",
        email: "E-mail:",
        submitButton: "Odeslat",
        updateSuccess: "Úspěšně aktualizováno",
        fetchError: "Nepodařilo se načíst uživatele",
        updateError: "Nepodařilo se aktualizovat uživatele",
        noUserFound: "Nenalezen žádný odpovídající uživatel",
    },
    italian: {
        editProfile: "Modifica Profilo",
        personalInfo: "Informazioni personali",
        userName: "Nome utente:",
        companyName: "Nome dell'azienda:",
        email: "Email:",
        submitButton: "Invia",
        updateSuccess: "Aggiornato con successo",
        fetchError: "Impossibile recuperare gli utenti",
        updateError: "Impossibile aggiornare l'utente",
        noUserFound: "Nessun utente corrispondente trovato",
    }
};

function ProfileSettings() {
    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);

    const currentLanguage = localStorage.getItem('language') || 'english';
    const lang = translations[currentLanguage];

    useEffect(() => {
        const fetchUsers = async () => {
            const storedEmail = localStorage.getItem('email');
            setEmail(storedEmail);
            try {
                const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users`);
                if (response.ok) {
                    const data = await response.json();
                    const matchedUser = data.find(user => user.email === storedEmail);
                    if (matchedUser) {
                        setUsers([matchedUser]);
                        setUserName(matchedUser.name);
                        setCompanyName(matchedUser.companyName);
                    } else {
                        console.error(lang.noUserFound);
                    }
                } else {
                    console.error(lang.fetchError);
                }
            } catch (error) {
                console.error(lang.fetchError, error);
            }
        };
        fetchUsers();
    }, [lang.noUserFound, lang.fetchError]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const user = {
            name: userName,
            companyName: companyName,
            email: email
        };
        try {
            const response = await fetch(`https://confess-data-tool-backend.vercel.app/api/users/${email}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            if (response.ok) {
                const updatedUser = await response.json();
                setUsers([updatedUser]);
                setSuccess(true);
            } else {
                console.error(lang.updateError);
            }
        } catch (error) {
            console.error(lang.updateError, error);
        }
    };

    useEffect(() => {
        if (success) {
            alert(lang.updateSuccess);
            setSuccess(false); // Reset success state
        }
    }, [success, lang.updateSuccess]);

    return (
        <section className='mt-5'>
            {users.map((value, index) => (
                <div key={index}>
                    <div className="container">
                        <img src={LogoLight} alt='logo' width={300} />
                        <h1 className="text-secondary mt-5">{lang.editProfile}</h1>
                        <hr />
                        <div className="row">
                            <div className="personal-info my-5">
                                <h3>{lang.personalInfo}</h3>
                                <form className="form-horizontal text-start" role="form" onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label className="col-lg-3 control-label">{lang.userName}</label>
                                        <div className="col-lg-8 mt-2">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={userName}
                                                onChange={(e) => setUserName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="col-lg-3 control-label">{lang.companyName}</label>
                                        <div className="col-lg-8 mt-2">
                                            <input
                                                className="form-control"
                                                type="text"
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label className="col-lg-3 control-label">{lang.email}</label>
                                        <div className="col-lg-8 mt-2">
                                            <input className="form-control" disabled type="text" value={email} />
                                        </div>
                                    </div>
                                    <div className="form-group mt-5">
                                        <div className="col mt-2">
                                            <input className="form-control bg-primary text-white" type="submit" value={lang.submitButton} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>
            ))}
        </section>
    );
}

export default ProfileSettings;
