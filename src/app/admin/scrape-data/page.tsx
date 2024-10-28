"use client"

import { Button, Card, CardBody, CardFooter, Input, Listbox, ListboxItem, Tab, Tabs } from '@nextui-org/react'
import axios from 'axios'
import React, { useState } from 'react'

const ScrapeData = () => {

    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState<undefined | string>(undefined);

    const searchCities = async (searchString: string) => {
        const response = await axios.get(`https://secure.geonames.org/searchJSON?q=${searchString}&maxRows=5&username=kishan&style=SHORT`);
        const parsed = response.data?.geonames;
        setCities(parsed?.map((city: {name: string})=>city.name)??[]);

        console.log({response});
    }

  return (
    <section className='m-10 grid grid-cols-3 gap-5'>
        <Card className='col-span-2'>
            <CardBody>
                <Tabs>
                    <Tab key={'location'} title="Location">
                        <Input type='text' label='Search for a location' onChange={(e) => searchCities(e.target.value)} />
                        
                        <div className="w-full min-h-[200px] max-w-[260px] border-small px-1 py-2 rounded-small border-default-200      dark:border-default-100 mt-5">  
                            <Listbox
                                aria-label="Actions"
                                onAction={(key) => setSelectedCity(key as string)}
                                >
                                {cities.map((city) => (
                                    <ListboxItem
                                    key={city}
                                    color="primary"
                                    className="text-primary-500"
                                    >
                                    {city}
                                    </ListboxItem>
                                ))}
                            </Listbox>
                        </div>
                    </Tab>
                </Tabs>
            </CardBody>
            <CardFooter className='flex flex-col gap-5'>
                <div>
                    {selectedCity && <h1 className='text-xl'>Scrape data for {selectedCity}</h1>}
                </div>
                <Button size='lg' className='w-full' color='primary'>
                    Scrape
                </Button>
            </CardFooter>
        </Card>
    </section>
  )
}

export default ScrapeData;