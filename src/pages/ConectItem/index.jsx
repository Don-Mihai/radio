import ConnectComponent from '../../components/ConnectComponent';
import { useParams } from 'react-router-dom';
import { data } from '../../data/data';

const ConectItem = () => {
  const { id } = useParams();

  const item = data.find((item) => item.id === Number(id));

  return <ConnectComponent data={item} />;
};

export default ConectItem;
