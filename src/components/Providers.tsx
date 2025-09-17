"use client"
import React from "react"
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"

export const Providers=({children} : {children: React.ReactNode}) =>{
    const client= new ApolloClient({
        link: new HttpLink({uri : process.env.NEXT_PUBLIC_GRAPHQL_API_URL}),
        cache: new InMemoryCache(),
    })
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};