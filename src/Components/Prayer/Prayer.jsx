import PropTypes from "prop-types"; // Import PropTypes
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";

export default function MediaCard({ name, time, image }) {
	return (
		<Card sx={{ width: "14vw" }}>
			<CardMedia
				sx={{ height: 140 }}
				image={image}
				title={name}
				alt={name} // Adding alt text for accessibility
			/>
			<CardContent>
				<Typography variant="h5" component="div">
					{name}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{time}
				</Typography>
			</CardContent>
		</Card>
	);
}

// Adding prop types validation
MediaCard.propTypes = {
	name: PropTypes.string.isRequired, // name should be a required string
	time: PropTypes.string.isRequired, // time should be a required string
	image: PropTypes.string.isRequired, // image should be a required string
};