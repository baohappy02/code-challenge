import './index.scss';

interface Props {
  value: boolean;
  label?: Array<string>;
  onChange?: () => void;
}

const AppSwitch: React.FC<Props> = ({
  value,
  label = ['NO', 'YES'],
  onChange
}) => {
  return (
    <>
      <div className="c__appSwitch">
        <label className="c__appSwitch_switch">
          <input
            className="c__appSwitch_input"
            type="checkbox"
            checked={value}
            onChange={onChange}
          />
          <span className="c__appSwitch_slider"></span>

          <div
            className={`c__appSwitch_label ${value ? 'active' : 'inactive'}`}
          >
            <div className="c__appSwitch_label_no">{label?.[0]}</div>
            <div className="c__appSwitch_label_yes">{label?.[1]}</div>
          </div>
        </label>
      </div>
    </>
  );
};

export default AppSwitch;
