import React from 'react'
import { Header } from "universal-components";
import { ComboBoxComponent } from "@syncfusion/ej2-react-dropdowns";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import type { Route } from './+types/admin-layout';
import { comboBoxItems, selectItems } from '@/constants';
import { cn, formatKey } from 'lib/utils';
import { world_map } from '@/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '@/appwrite/client';
import { useNavigate } from 'react-router';

//fetch countries from the rest https://restcountries.com/v3.1/all
export const loader = async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();


    return data.map((country: any) => ({
        name: country.flag + country.name.common,
        coordinates: country.latlng,
        value: country.name.common,
        openStreetMap: country.maps?.openStreetMap
    }));
}

const CreateTrips = ({ loaderData }: Route.ComponentProps) => {
    const navigate = useNavigate();

    const countries = loaderData as unknown as Country[];

    const [formData, setFormData] = React.useState<TripFormData>({
        country: countries[0]?.name || "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: ""
    });

    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
        e.preventDefault();
        setLoading(true);

        if (!formData.country || !formData.travelStyle || !formData.interest || !formData.budget || !formData.groupType) {
            setError("Please fill in all fields");
            setLoading(false);
            return;
        }

        if (formData.duration <= 0 || formData.duration > 15) {
            setError("Duration must be between 1 and 15 days");
            setLoading(false);
            return;
        }

        // check if the user is logged in
        const user = await account.get();

        if (!user.$id) {
            console.log("User not authenticated");
            setError("Please login to create a trip!");
            setLoading(false);
            return;
        }

        const { country, travelStyle, interest, budget, duration, groupType } = formData;

        try {
            const response = await fetch("/api/create-trip", {
                method: "post",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    country, travelStyle,
                    interests: interest,
                    budget, duration, groupType,
                    userId: user.$id
                })
            });

            const result: CreateTripResponse = await response.json();

            if (result?.id) navigate(`/trips/${result.id}`);

            else {
                setError("Failed to generate the trip!");
                console.log("Failed to generate the trip");
            }

        } catch (error) {
            console.log("Error generating trip", error);
            setError("Something went wrong, please try again!");
        } finally {
            setLoading(false);
        }
    };

    // handle country selection to track the selected country
    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData({ ...formData, [key]: value });
    }


    // reformat countries to have a text and value property
    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value
    }))

    const mapData = [{
        country: formData.country,
        color: "#EA38E2",
        coordinates: countries.find(country => country.name === formData.country)?.coordinates || []
    }]

    return (
        <main className="wrapper flex flex-col gap-10 pb-20">
            <Header title="Add a new trip" description="View and Edit AI-generated travel plans" />
            <section className='wrapper-md mt-2.5'>
                <form onSubmit={handleSubmit} className='trip-form'>
                    <div>
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id='country'
                            dataSource={countryData}
                            fields={{ text: "text", value: "value" }}
                            placeholder='Select a country'
                            className='combo-box'
                            change={(e: { value: string | undefined }) => {
                                if (e.value) {
                                    handleChange('country', e.value);
                                }
                            }}
                            allowFiltering={true}
                            filtering={(e) => {
                                const filterValue = e.text.toLowerCase();

                                e.updateData(
                                    countryData.filter((country) => {
                                        return country.text.toLowerCase().includes(filterValue);
                                    })
                                )
                            }}
                        />
                    </div>

                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id='duration'
                            type="number"
                            name='duration'
                            placeholder='Enter duration in days'
                            className='form-input placeholder:text-gray-100'
                            onChange={(e) => handleChange("duration", e.target.value)}
                        />
                    </div>

                    {selectItems.map((key) => (
                        <div className='' key={key}>
                            <label htmlFor={key}>{formatKey(key)}</label>

                            <ComboBoxComponent
                                id={key}
                                dataSource={comboBoxItems[key].map((item) => ({
                                    text: item, value: item
                                }))}
                                fields={{ text: "text", value: "value" }}
                                placeholder={`Select ${formatKey(key)}`}
                                className='combo-box'
                                change={(e: { value: string | undefined }) => {
                                    if (e.value) {
                                        handleChange(key, e.value);
                                    }
                                }}
                                allowFiltering={true}
                                filtering={(e) => {
                                    const filterValue = e.text.toLowerCase();

                                    const filteredArray = comboBoxItems[key].filter(item => item.toLowerCase().includes(filterValue));

                                    e.updateData(
                                        filteredArray.map(item => ({
                                            text: item, value: item
                                        }))
                                    )
                                }}
                            />
                        </div>
                    ))}

                    <div>
                        <label htmlFor="location">Location on the world map</label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    dataSource={mapData}
                                    shapeData={world_map}
                                    shapeDataPath='country'
                                    shapePropertyPath="name"
                                    shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className='bg-gray-200 h-px w-full' />

                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}
                    <footer className="px-6 w-full">
                        <ButtonComponent type='submit' className='!w-full !h-12 button-class' disabled={loading}>
                            <img src={loading ? "/assets/icons/loader.svg" : "/assets/icons/magic-star.svg"} alt="loading" className={cn("size-5", { 'animate-spin': loading })} />
                            <span className='p-16-semibold text-white'>
                                {loading ? "Generating..." : "Generate Trip"}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    )
}
export default CreateTrips
