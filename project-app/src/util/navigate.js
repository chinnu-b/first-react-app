// common useNavigate function
import { useNavigate } from 'react-router-dom';


export function CustomNavigate({path}) {
    const navigate = useNavigate();
    navigate(path);
    return null
}