import {useParams} from 'react-router-dom';
import {useAuth} from '../commerce/Auth';
export default function Policy(){const {kind}=useParams();const {config}=useAuth();const titles={shipping:'Shipping policy',returns:'Returns & refunds',privacy:'Privacy policy',terms:'Terms of service'};return <div className="commerce-page"><h1>{titles[kind]||'Policy'}</h1><p style={{whiteSpace:'pre-wrap',lineHeight:1.9}}>{config?.[`${kind}Policy`]||'This demo store has not published this policy yet. Live checkout and Google product-feed publication require completed store policies.'}</p></div>}
