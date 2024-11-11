import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import PersonDetails from "../components/PersonDetails";
import FilmRolesRanking from "../common/FilmRolesRanking";
import PersonKnownFor from "../components/PersonKnownFor";
import PersonFilmography from "../components/PersonFilmography";
import Download from "../components/Download";
import Footer from "../components/Footer";

const PersonPage = () => {
	const { personId } = useParams();

	const [actor, setActor] = useState({});
	const [loading, setLoading] = useState(true);

	const fetchPerson = async (nameId) => {
		try {
			const response = await axios.post(
				import.meta.env.VITE_SERVER_DOMAIN + "/get-actor",
				{ nameId: nameId },
			);
			return response.data.actor;
		} catch (err) {
			console.error(err);
		}
	};


	useEffect(() => {
		const loadPerson = async () => {
			const personData = await fetchPerson(personId);
			setActor(personData);
			setLoading(false); // Set loading to false after fetching
		};

		loadPerson();
	}, [personId]);

	return loading ? (
		<Loader />
	) : (
		<>
			<PersonDetails person={actor} />
      <PersonKnownFor person={actor} />
      <FilmRolesRanking media={actor} />
      <PersonFilmography person={actor} />
			<Download />
      <Footer />
		</>
	);
};

export default PersonPage;
