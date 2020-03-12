
import headerNav from '../components/header/nav';

import navigate from '../components/footer/navigate.vue';
import productcard from '../components/common/productcard.vue';
import myloading from '../components/common/loading.vue';

import {
  Tag,
  Col,
  Icon,
  Image,Loading,
  Cell,Divider,CountDown,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionButton,
  GoodsActionIcon,
  ActionSheet,
  Sku,Pagination,
  Card,Button,SwipeCell,Dialog,Tab, Tabs,Row,Checkbox, CheckboxGroup, SubmitBar,NavBar,Tabbar, TabbarItem,Panel,List,Step, Steps,Field ,
  SidebarItem, Sidebar,Popup,Stepper,RadioGroup, Radio,Picker,Uploader,Info
} from 'vant';

const components=[
    Tag,
    Col,
    Icon,
	Image,Loading,
    Cell,Divider,CountDown,
    CellGroup,
    Swipe,
    SwipeItem,
    GoodsAction,
    GoodsActionButton,
    GoodsActionIcon,
    ActionSheet,
    Sku,Pagination,
    Card,
    Button,
    SwipeCell ,
    Dialog ,
    headerNav, 
    Tab, Tabs,Toast,Row,Checkbox, CheckboxGroup, SubmitBar,NavBar ,Tabbar, TabbarItem,navigate,Panel,List ,Step, Steps,Field ,
    SidebarItem, Sidebar,Popup,Stepper,RadioGroup, Radio,Picker,Uploader,Info,
	productcard,myloading
]


export default (Vue)=>{
    components.forEach(Component => {
        Vue.component(Component.name, Component)
    });
}
