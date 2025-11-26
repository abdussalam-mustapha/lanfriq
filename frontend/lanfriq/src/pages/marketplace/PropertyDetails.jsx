import { useParams } from 'react-router-dom'
import Section from '../../components/ui/Section'

const PropertyDetails = () => {
  const { propertyId } = useParams()

  return (
    <Section variant="default">
      <h1>Property Details</h1>
      <p>Property ID: {propertyId}</p>
    </Section>
  )
}

export default PropertyDetails
