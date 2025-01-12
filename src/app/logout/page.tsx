import { cookies } from 'next/headers'
import React from 'react'
import Actions from './actions';

const Logout = () => {

    async function deleteCookie() {
        "use server";
        (await cookies()).delete("access_token");
    }

  return (
    <Actions deleteCookie={deleteCookie} />
  )
}

export default Logout