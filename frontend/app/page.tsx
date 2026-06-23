"use client";

import {useEffect, useRef, useState} from "react";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
};

export default function Home() {
  const [users, setUser] = useState<User[]>([]);
  const formRef = useRef<HTMLFormElement>(null);

  // récupérer les utilisateurs

  async function getUser(): Promise<void> {
    const response = await fetch("http://localhost:3001/users");
    const data = await response.json();

    setUser(data);
  }

  //appel initial au montage du composant
  useEffect(() => {
    getUser();
  }, []);

  // POST
  async function createUser(formData: FormData) {
    const data = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      email: formData.get("email")
    };

    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data)
    });

    const createdUser = await response.json();

    // une fois l'utilisateur enregistré en base, on recharge la liste
    setUser(prev => [...prev, createdUser]);

    // Nettoie le fromulaire
    formRef.current?.reset();
  }

  // DELETE
  async function deleteUser(id: number): Promise<void> {
    await fetch(`http://localhost:3001/users/${id}`, {
      method: "DELETE"
    });

    setUser(prev => prev.filter(user => user.id !== id));
  }

  // PUT

  function handleEditUser(id: number, updatedFields: Partial<User>) {
    setUser(prev =>
      prev.map(user => (user.id === id ? {...user, ...updatedFields} : user))
    );
  }

  async function updateUser(
    id: number,
    updatedUser: Partial<User>
  ): Promise<void> {
    await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(updatedUser)
    });

    setUser(prev =>
      prev.map(user => (user.id === id ? {...user, ...updatedUser} : user))
    );
  }

  return (
    <div className="flex justify-center items-center h-screen gap-12">
      <div className="">
        <form
          ref={formRef}
          action={createUser}
          className="flex flex-col gap-4">
          <input
            type="text"
            name="firstname"
            placeholder="firstname"
            className="border rounded"
          />
          <input
            type="text"
            name="lastname"
            placeholder="lastname"
            className="border rounded"
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            className="border rounded"
          />
          <button type="submit" className="border rounded bg-blue-300">
            Submit
          </button>
        </form>
      </div>

      <div className="min-w-2xl  bg-purple-200">
        <table className="min-w-xl ">
          <caption>Liste des opération CRUD en Nest et Drizzlr</caption>

          <thead>
            <tr>
              <th scope="col" className="text-center align-middle">
                Nom
              </th>
              <th scope="col" className="text-center align-middle">
                Prénom
              </th>
              <th scope="col" className="text-center align-middle">
                Email
              </th>
              <th scope="col" className="text-center align-middle">
                Action
              </th>
              <th scope="col" className="text-center align-middle"></th>
            </tr>
          </thead>

          <tbody>
              {users.map(({firstname, lastname, email, id}) => (
                <tr key={id} className="text-center align-middle">
                  <td>
                    <input
                      type="text"
                      value={firstname}
                      onChange={e =>
                        handleEditUser(id, {firstname: e.target.value})
                      }
                      className="text-center border-none bg-transparent focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={lastname}
                      onChange={e =>
                        handleEditUser(id, {lastname: e.target.value})
                      }
                      className="text-center border-none bg-transparent focus:outline-none"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={email}
                      onChange={e =>
                        handleEditUser(id, {email: e.target.value})
                      }
                      className="text-center border-none bg-transparent focus:outline-none"
                    />
                  </td>
                  <td>
                    <button
                      onClick={() => deleteUser(id)}
                      className="rounded-md bg-red-400/10 px-2 py-1 text-xs font-medium text-red-400">
                      Delete
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        updateUser(id, users.find(u => u.id === id)!)
                      }
                      className="rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400">
                      UPDATE
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
