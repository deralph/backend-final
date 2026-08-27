
async function getLocation(long, lat) {
    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${long}&format=json`
        );

        if (!res.ok) {
            throw new Error(`Reverse geocoding failed: ${res.status}`);
        }

        const data = await res.json();

        const { suburb, state, country } = data.address

        return { suburb, state, country };

    } catch (error) {
        throw error;
    }
}

module.exports = { getLocation }