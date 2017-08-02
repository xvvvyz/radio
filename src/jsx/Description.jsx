import Inferno from 'inferno';
import Component from 'inferno-component';
import '../scss/Description.scss';

export default function Description(props) {
  if (props.hide) return;

  return (
    <div className="Description">
      <p>Select or search for a tag. Listen&hellip; Don&rsquo;t like what you hear? Click refresh. You can always add or remove tags to switch things up.</p>
    </div>
  );
};
