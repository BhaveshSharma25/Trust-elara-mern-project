import axios from "axios";
import { useEffect, useState } from "react";

export function usePostMethod() {
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        axios.post('http://staging.alphonic.net.in:9500/api/v1/services/paginate/doctor-visit',
            { "page": 1, "perPage": 12, "searchString": "", "cityId": "687769f135f7ac56387bf21a", "filters": { "isActive": true, "ageGroup": [], "vital": [], "preventive": [] }, "sort": { "sortBy": "name", "order": "asc" } }
        )
            .then((response) => {
                setPostData(response.data.data.data || []);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return postData;
}

export default usePostMethod;